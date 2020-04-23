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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var routerConfigs_1 = __importDefault(require("../configs/routerConfigs"));
var express_joi_validation_1 = require("express-joi-validation");
var uuid_1 = require("uuid");
var Joi = __importStar(require("@hapi/joi"));
var User_1 = require("../models/User");
var sequelize_1 = require("sequelize");
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
var router = express_1.default.Router(routerConfigs_1.default.routerOptions);
router
    .route('/user/:id')
    .all(validator.params(userParamsSchema), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, User_1.User.findByPk(userId)];
            case 2:
                user = _a.sent();
                if (user && !user.isDeleted) {
                    res.locals.user = user;
                    next();
                }
                else {
                    res.status(404).send({
                        message: "User with id " + userId + " doesn't exist.",
                    });
                }
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                next(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); })
    .get(function (req, res, next) {
    res.status(200).json(res.locals.user);
    next();
})
    .put(validator.body(userBodySchema), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var updatedUser, updatedUserInfo, userUpdated, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                updatedUser = __assign(__assign({}, res.locals.user), { login: req.body.login, password: req.body.password, age: req.body.age });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, User_1.User.update({ updatedUser: updatedUser }, {
                        where: { id: res.locals.user.id },
                        returning: true,
                    })];
            case 2:
                updatedUserInfo = _a.sent();
                userUpdated = updatedUserInfo[1][0];
                res.status(200).json(userUpdated);
                next();
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                next(err_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); })
    .delete(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    return __generator(this, function (_a) {
        userId = res.locals.user.id;
        try {
            User_1.User.update({ isDeleted: true }, {
                where: { id: userId },
            });
            res.status(200).send({
                message: "User with id " + userId + " successfully deleted!",
            });
            next();
        }
        catch (err) {
            next(err);
        }
        return [2 /*return*/];
    });
}); });
router
    .route('/user')
    .post(validator.body(userBodySchema), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var newUser, addedUser, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                newUser = {
                    id: uuid_1.v4(),
                    login: req.body.login,
                    password: req.body.password,
                    age: req.body.age,
                    isDeleted: false,
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, User_1.User.create(newUser)];
            case 2:
                addedUser = _a.sent();
                res.status(200).json(addedUser);
                next();
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                next(err_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/autoSuggestUsers', validator.query(autoSuggestQuerySchema), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, loginSubstring, limit, matchingUsers, err_4;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.query, loginSubstring = _a.loginSubstring, limit = _a.limit;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, User_1.User.findAll({
                        where: {
                            login: (_b = {},
                                _b[sequelize_1.Op.like] = "%" + loginSubstring + "%",
                                _b),
                            isDeleted: false,
                        },
                        limit: +limit,
                        order: ['login', 'ASC'],
                    })];
            case 2:
                matchingUsers = _c.sent();
                if (matchingUsers && matchingUsers.length > 0) {
                    res.status(200).json(matchingUsers);
                }
                else {
                    res.status(204).json({
                        message: "No user found matching substring " + loginSubstring,
                    });
                }
                return [3 /*break*/, 4];
            case 3:
                err_4 = _c.sent();
                next(err_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.usersRoutes = router;
