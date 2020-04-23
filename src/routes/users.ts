import express from 'express';
import configs from '../configs/routerConfigs';
import {
  ContainerTypes,
  createValidator,
  ValidatedRequest,
  ValidatedRequestSchema,
} from 'express-joi-validation';
import { User } from '../types/User';
import { v4 as uuidv4 } from 'uuid';
import * as Joi from '@hapi/joi';
import { User as UserModel } from '../models/User';
import { Op } from 'sequelize';

const validator = createValidator();

// RegExp patterns for password and id
const passwordRegExp = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
const uuidRegExp = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

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

const router = express.Router(configs.routerOptions);

router
  .route('/user/:id')
  .all(validator.params(userParamsSchema), async (req, res, next) => {
    const userId = req.params.id;
    try {
      const user = await UserModel.findByPk(userId);
      if (user && !user.isDeleted) {
        res.locals.user = user;
        next();
      } else {
        res.status(404).send({
          message: `User with id ${userId} doesn't exist.`,
        });
      }
    } catch (err) {
      next(err);
    }
  })
  .get((req: ValidatedRequest<UserRequestBodySchema>, res, next) => {
    res.status(200).json(res.locals.user);
    next();
  })
  .put(
    validator.body(userBodySchema),
    async (req: ValidatedRequest<UserRequestBodySchema>, res, next) => {
      const updatedUser = {
        ...res.locals.user,
        login: req.body.login,
        password: req.body.password,
        age: req.body.age,
      };
      try {
        const updatedUserInfo = await UserModel.update(
          { updatedUser },
          {
            where: { id: res.locals.user.id },
            returning: true,
          },
        );
        const userUpdated = updatedUserInfo[1][0];
        res.status(200).json(userUpdated);
        next();
      } catch (err) {
        next(err);
      }
    },
  )
  .delete(async (req, res, next) => {
    const userId = res.locals.user.id;
    try {
      UserModel.update(
        { isDeleted: true },
        {
          where: { id: userId },
        },
      );
      res.status(200).send({
        message: `User with id ${userId} successfully deleted!`,
      });
      next();
    } catch (err) {
      next(err);
    }
  });
router
  .route('/user')
  .post(
    validator.body(userBodySchema),
    async (req: ValidatedRequest<UserRequestBodySchema>, res, next) => {
      const newUser: User = {
        id: uuidv4(),
        login: req.body.login,
        password: req.body.password,
        age: req.body.age,
        isDeleted: false,
      };
      try {
        const addedUser = await UserModel.create(newUser);
        res.status(200).json(addedUser);
        next();
      } catch (err) {
        next(err);
      }
    },
  );
router.get(
  '/autoSuggestUsers',
  validator.query(autoSuggestQuerySchema),
  async (req, res, next) => {
    const { loginSubstring, limit } = req.query;
    try {
      const matchingUsers = await UserModel.findAll({
        where: {
          login: {
            [Op.like]: `%${loginSubstring}%`,
          },
          isDeleted: false,
        },
        limit: +limit,
        order: ['login', 'ASC'],
      });
      if (matchingUsers && matchingUsers.length > 0) {
        res.status(200).json(matchingUsers);
      } else {
        res.status(204).json({
          message: `No user found matching substring ${loginSubstring}`,
        });
      }
    } catch (err) {
      next(err);
    }
  },
);

export const usersRoutes = router;
