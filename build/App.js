"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var sequelize_1 = require("sequelize");
var users_1 = require("./routes/users");
var dbConfigs_1 = require("./configs/dbConfigs");
var User_1 = require("./models/User");
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.express = express_1.default();
        this.mountRoutes();
        this.sequelize = new sequelize_1.Sequelize(dbConfigs_1.dbDatabase, dbConfigs_1.dbUsername, dbConfigs_1.dbPassword, {
            host: dbConfigs_1.dbHost,
            dialect: dbConfigs_1.dbDialect,
            pool: __assign({}, dbConfigs_1.poolConfigs),
            ssl: true,
            native: true,
        });
        this.sequelize
            .authenticate()
            .then(function () {
            User_1.createUsersTable(_this.sequelize);
            console.log('Connection has been established successfully.');
        })
            .catch(function (err) {
            console.error('Unable to connect to the database:', err);
        });
    }
    App.prototype.mountRoutes = function () {
        this.express.use(express_1.default.json());
        this.express.use('/', users_1.usersRoutes);
    };
    return App;
}());
exports.default = new App().express;
