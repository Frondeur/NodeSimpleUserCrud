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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var uuid_1 = require("uuid");
var usersMock_1 = __importDefault(require("./mocks/usersMock"));
var routerConfigs_1 = __importDefault(require("./configs/routerConfigs"));
var Joi = __importStar(require("@hapi/joi"));
var express_joi_validation_1 = require("express-joi-validation");
var validator = express_joi_validation_1.createValidator();
// RegExp patterns for password and id
var passwordRegExp = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
var uuidRegExp = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
var userBodySchema = Joi.object({
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
var userParamsSchema = Joi.object({
    id: Joi.string()
        .regex(uuidRegExp)
        .required(),
});
var autoSuggestQuerySchema = Joi.object({
    loginSubstring: Joi.string().required(),
    limit: Joi.number()
        .required()
        .positive()
        .integer()
        .greater(0),
});
var App = /** @class */ (function () {
    function App() {
        this.express = express_1.default();
        this.mountRoutes();
        this.users = usersMock_1.default;
    }
    App.prototype.mountRoutes = function () {
        var _this = this;
        var router = express_1.default.Router(routerConfigs_1.default.routerOptions);
        this.express.use(express_1.default.json());
        router
            .route('/user/:id')
            .all(validator.params(userParamsSchema), function (req, res, next) {
            var userId = req.params.id;
            var user = _this.users.find(function (user) { return user.id === userId; });
            if (user && !user.isDeleted) {
                res.locals.user = user;
                next();
            }
            else {
                res.status(404).send({
                    Message: "User with id " + userId + " doesn't exist.",
                });
            }
        })
            .get(function (req, res, next) {
            res.status(200).json(res.locals.user);
            next();
        })
            .put(validator.body(userBodySchema), function (req, res, next) {
            var updatedUser = __assign(__assign({}, res.locals.user), { login: req.body.login, password: req.body.password, age: req.body.age });
            var userIndex = _this.users.findIndex(function (user) { return user.id === res.locals.user.id; });
            _this.users.splice(userIndex, 1, updatedUser);
            res.status(200).json(updatedUser);
            next();
        })
            .delete(function (req, res, next) {
            var userIndex = _this.users.findIndex(function (user) { return user.id === res.locals.user.id; });
            _this.users[userIndex].isDeleted = true;
            var remainingUsers = _this.users.filter(function (user) { return !user.isDeleted; });
            res.status(200).json({
                deletedUser: res.locals.user,
                remainingUsers: remainingUsers,
                remainingUserCount: remainingUsers.length,
            });
            next();
        });
        router
            .route('/user')
            .post(validator.body(userBodySchema), function (req, res, next) {
            var newUser = {
                id: uuid_1.v4(),
                login: req.body.login,
                password: req.body.password,
                age: req.body.age,
                isDeleted: false,
            };
            _this.users.push(newUser);
            res.status(200).json(newUser);
            next();
        });
        router.get('/autoSuggestUsers', validator.query(autoSuggestQuerySchema), function (req, res, next) {
            var _a = req.query, loginSubstring = _a.loginSubstring, limit = _a.limit;
            var availableUserList = _this.users.filter(function (user) { return !user.isDeleted; });
            var matchingUsers = availableUserList.filter(function (user) { return user.login.includes(loginSubstring); });
            if (matchingUsers.length > 0) {
                var sortedByLogin = matchingUsers.sort(function (a, b) {
                    if (a.login < b.login)
                        return -1;
                    if (a.login > b.login)
                        return 1;
                    return 0;
                });
                var firstLimitUsers = sortedByLogin.slice(0, +limit); // TO DO: Add ValidatedRequest type to req
                res.status(200).json(firstLimitUsers);
            }
            else {
                res.status(204).json({
                    message: "No user found matching substring " + loginSubstring,
                });
            }
            next();
        });
        this.express.use('/', router);
    };
    return App;
}());
exports.default = new App().express;
