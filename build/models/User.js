"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return User;
}(sequelize_1.Model));
exports.User = User;
exports.createUsersTable = function (sequelizeInstance) {
    User.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            primaryKey: true,
        },
        login: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false,
        },
        password: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false,
        },
        age: {
            type: new sequelize_1.DataTypes.NUMBER(),
            allowNull: false,
        },
        isDeleted: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
        },
    }, {
        tableName: 'users',
        sequelize: sequelizeInstance,
    });
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
    }
    catch (err) {
        console.log(err);
    }
};
