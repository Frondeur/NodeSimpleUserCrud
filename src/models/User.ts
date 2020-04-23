import { Sequelize, Model, DataTypes } from 'sequelize';

export class User extends Model {
  public id!: string;
  public login!: string;
  public password!: string;
  public age!: number;
  public isDeleted!: boolean;
}

export const createUsersTable = (sequelizeInstance: Sequelize): void => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      login: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      password: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      age: {
        type: new DataTypes.NUMBER(),
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      tableName: 'users',
      sequelize: sequelizeInstance,
    },
  );
  try {
    User.bulkCreate([
      {
        id: 'dbe70c22-86c9-4bc9-a2c3-82b5d6a7c45e',
        login: 'User2',
        password: 'user2.123',
        age: 60,
        isDeleted: false,
      },
      {
        id: 'dbe70c22-86r9-tbc9-a2c3-82b5d6a7c4we',
        login: 'User25',
        password: 'user25.123',
        age: 60,
        isDeleted: false,
      },
      {
        id: '3e999c10-9389-4801-a3f5-a9f1fe3dfe7a',
        login: 'User1',
        password: 'user1.123',
        age: 6,
        isDeleted: false,
      },
      {
        id: '66aebdd6-8991-4132-b915-1ebc1cee3c3c',
        login: 'User3',
        password: 'user3.123',
        age: 50,
        isDeleted: false,
      },
      {
        id: '869bc3cb-7046-4d85-8e5c-5cfd4deda7cb',
        login: 'User4',
        password: 'user4.123',
        age: 30,
        isDeleted: false,
      },
    ]);
  } catch (err) {
    console.log(err);
  }
};
