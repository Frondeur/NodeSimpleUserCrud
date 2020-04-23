import express from 'express';
import { Sequelize } from 'sequelize';
import { usersRoutes } from './routes/users';
import {
  dbDatabase,
  dbDialect,
  dbHost,
  dbPassword,
  dbUsername,
  poolConfigs,
} from './configs/dbConfigs';
import { createUsersTable } from './models/User';

class App {
  public express: any;
  private sequelize: Sequelize;

  constructor() {
    this.express = express();
    this.mountRoutes();
    this.sequelize = new Sequelize(dbDatabase, dbUsername, dbPassword, {
      host: dbHost,
      dialect: dbDialect,
      pool: { ...poolConfigs },
      ssl: true,
      native: true,
    });

    this.sequelize
      .authenticate()
      .then(() => {
        createUsersTable(this.sequelize);
        console.log('Connection has been established successfully.');
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });
  }

  private mountRoutes(): void {
    this.express.use(express.json());
    this.express.use('/', usersRoutes);
  }
}

export default new App().express;
