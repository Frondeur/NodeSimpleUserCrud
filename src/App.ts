import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { User } from './types/User';
import userData from './mocks/usersMock';
import configs from './configs/routerConfigs';
import * as Joi from '@hapi/joi';
import { Sequelize } from 'sequelize';

import {
  // Use this as a replacement for express.Request
  ValidatedRequest,
  // Extend from this to define a valid schema type/interface
  ValidatedRequestSchema,
  // Creates a validator that generates middlewares
  createValidator,
  ContainerTypes,
} from 'express-joi-validation';

const validator = createValidator();

// RegExp patterns for password and id
const passwordRegExp = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
const uuidRegExp = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

const dbConfigs =
  'postgres://muahlfgukpqstc:50ab78c74334dc60a2ca58a8247fd94eefa71d1a0a046c271c267bb7ba263f29@ec2-46-137-156-205.eu-west-1.compute.amazonaws.com:5432/dc01e2b27bi803';

interface UserRequestBodySchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    login: string;
    age: number;
    password: string;
  };
}

interface UserRequestParamsSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}

interface AutoSuggestRequestQuerySchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    loginSubstring: string;
    limit: number;
  };
}

const userBodySchema: Joi.ObjectSchema<User> = Joi.object({
  login: Joi.string().required(),
  age: Joi.number()
    .integer()
    .required()
    .min(4)
    .max(140),
  password: Joi.string()
    .regex(passwordRegExp)
    .required(),
});

const userParamsSchema = Joi.object({
  id: Joi.string()
    .regex(uuidRegExp)
    .required(),
});

const autoSuggestQuerySchema = Joi.object({
  loginSubstring: Joi.string().required(),
  limit: Joi.number()
    .required()
    .positive()
    .integer()
    .greater(0),
});

class App {
  public express: any;
  private readonly users: User[];
  private sequelize: Sequelize;

  constructor() {
    this.express = express();
    this.mountRoutes();
    this.users = userData;
    // this.sequelize = new Sequelize(
    //   'dc01e2b27bi803',
    //   'muahlfgukpqstc',
    //   '50ab78c74334dc60a2ca58a8247fd94eefa71d1a0a046c271c267bb7ba263f29',
    //   {
    //     host: 'ec2-46-137-156-205.eu-west-1.compute.amazonaws.com',
    //     dialect: 'postgres',
    //     pool: {
    //       max: 5,
    //       min: 0,
    //       acquire: 30000,
    //       idle: 10000,
    //     },
    //     ssl: true,
    //   },
    // );
    // this.sequelize = new Sequelize(dbConfigs);
    this.sequelize = new Sequelize(process.env.DATABASE_URL as string, {
      ssl: true,
    });

    this.sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });
  }

  private mountRoutes(): void {
    const router = express.Router(configs.routerOptions);

    this.express.use(express.json());

    router
      .route('/user/:id')
      .all(validator.params(userParamsSchema), (req, res, next) => {
        const userId = req.params.id;
        const user = this.users.find(user => user.id === userId);
        if (user && !user.isDeleted) {
          res.locals.user = user;
          next();
        } else {
          res.status(404).send({
            Message: `User with id ${userId} doesn't exist.`,
          });
        }
      })
      .get((req: ValidatedRequest<UserRequestBodySchema>, res, next) => {
        res.status(200).json(res.locals.user);
        next();
      })
      .put(
        validator.body(userBodySchema),
        (req: ValidatedRequest<UserRequestBodySchema>, res, next) => {
          const updatedUser = {
            ...res.locals.user,
            login: req.body.login,
            password: req.body.password,
            age: req.body.age,
          };
          const userIndex = this.users.findIndex(
            user => user.id === res.locals.user.id,
          );
          this.users.splice(userIndex, 1, updatedUser);
          res.status(200).json(updatedUser);
          next();
        },
      )
      .delete((req: ValidatedRequest<UserRequestBodySchema>, res, next) => {
        const userIndex = this.users.findIndex(
          user => user.id === res.locals.user.id,
        );
        this.users[userIndex].isDeleted = true;
        const remainingUsers = this.users.filter(user => !user.isDeleted);
        res.status(200).json({
          deletedUser: res.locals.user,
          remainingUsers,
          remainingUserCount: remainingUsers.length,
        });
        next();
      });
    router
      .route('/user')
      .post(
        validator.body(userBodySchema),
        (req: ValidatedRequest<UserRequestBodySchema>, res, next) => {
          const newUser: User = {
            id: uuidv4(),
            login: req.body.login,
            password: req.body.password,
            age: req.body.age,
            isDeleted: false,
          };
          this.users.push(newUser);
          res.status(200).json(newUser);
          next();
        },
      );
    router.get(
      '/autoSuggestUsers',
      validator.query(autoSuggestQuerySchema),
      (req, res, next) => {
        const { loginSubstring, limit } = req.query;
        const availableUserList = this.users.filter(user => !user.isDeleted);
        const matchingUsers = availableUserList.filter(
          user => user.login.includes(loginSubstring as string), // TO DO: Add ValidatedRequest type to req
        );
        if (matchingUsers.length > 0) {
          const sortedByLogin = matchingUsers.sort((a: User, b: User) => {
            if (a.login < b.login) return -1;
            if (a.login > b.login) return 1;
            return 0;
          });
          const firstLimitUsers = sortedByLogin.slice(0, +limit as number); // TO DO: Add ValidatedRequest type to req
          res.status(200).json(firstLimitUsers);
        } else {
          res.status(204).json({
            message: `No user found matching substring ${loginSubstring}`,
          });
        }
        next();
      },
    );
    this.express.use('/', router);
  }
}

export default new App().express;
