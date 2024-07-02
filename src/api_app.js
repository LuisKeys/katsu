"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiApp = void 0;
var express_1 = require("express");
var prompt_handler_1 = require("./prompts/prompt_handler");
var auth_user_1 = require("./authentication/auth_user");
var token_1 = require("./authentication/token");
var token_2 = require("./authentication/token");
var token_3 = require("./authentication/token");
var api_transf_1 = require("./prompts/api_transf");
var openai_1 = require("openai");
var dotenv_1 = require("dotenv");
/**
 * Module for initializing the API application.
 * @module apiApp
 */
dotenv_1.default.config();
var port = parseInt(process.env.PORT || "3020");
var api_root = "/api/v1/";
/**
 * Initializes the API application.
 * @function apiApp
 */
var apiApp = function () {
    var _this = this;
    console.log("API mode is on.");
    var app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    /**
     * Handles the auth route.
     * @name POST /auth
     * @function
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    app.post(api_root + "auth", function (req, res) {
        var _a = req.body, user = _a.user, password = _a.password;
        try {
            if ((0, auth_user_1.authUser)(user, password)) {
                var token = (0, token_1.generateToken)(user);
                res.status(200).json({ token: token });
                return;
            }
            else {
                throw new Error("Invalid credentials");
            }
        }
        catch (error) {
            res.status(401).json({ message: error["message"] });
        }
    });
    /**
     * Handles the prompt route.
     * @name POST /prompt
     * @function
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    app.post(api_root + "prompt", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, token, prompt, result, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, token = _a.token, prompt = _a.prompt;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    if (!(0, token_2.validateToken)(token)) {
                        throw new Error("Invalid token");
                    }
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var user = String((0, token_3.getPayloadFromToken)(token));
                            var userId = Number(process.env.AUTH_MEMBER_ID);
                            askPrompt(prompt, user, userId, openai_1.default)
                                .then(function (result) { return resolve(result); })
                                .catch(function (error) { return reject(error); });
                        })];
                case 2:
                    result = _b.sent();
                    if (result) {
                        result = (0, api_transf_1.transfResAPI)(result);
                    }
                    res.status(200).json({ answer: result });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    res.status(401).json({ message: error_1["message"] });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    /**
     * Starts the server and listens on the specified port.
     * @function
     * @param {number} port - The port number to listen on.
     */
    app.listen(port, function () {
        console.log("api listening at port:".concat(port));
    });
};
exports.apiApp = apiApp;
var askPrompt = function (prompt, user, userId, openai) { return __awaiter(void 0, void 0, void 0, function () {
    var userName, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(user != process.env.AUTH_USER)) return [3 /*break*/, 1];
                console.log("You are not a registered user. Please contact the administrator to register.");
                return [3 /*break*/, 3];
            case 1:
                userName = process.env.AUTH_USER || "";
                return [4 /*yield*/, (0, prompt_handler_1.promptHandler)(prompt, userId, false, openai)];
            case 2:
                result = _a.sent();
                return [2 /*return*/, result];
            case 3: return [2 /*return*/, undefined];
        }
    });
}); };
