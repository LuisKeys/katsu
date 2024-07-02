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
exports.promptHandler = void 0;
var clean_1 = require("./clean");
var constants = require("./constants");
var demoData = require("../demo/demo_data");
var handlers = require("./handlers");
var help = require("../nl/help");
var nlPromptType = require("./prompt_type");
var promptsHistory = require("./check_history");
var savePrompt = require("./save_prompt");
var prompt_handler_utils_1 = require("./prompt_handler_utils");
var result_object_1 = require("./result_object");
/**
 * @fileoverview This module exports the `promptHandler` function which handles different types of prompts and performs corresponding actions.
 * @module promptHandler
 */
/**
 * Handles different types of prompts and performs corresponding actions.
 * @async
 * @param {string} prompt - The prompt to be handled.
 * @param {number} userId - The id of the user.
 * @param {boolean} isDebug - Indicates whether the debug mode is enabled.
 * @returns {Promise<void>} - A promise that resolves when the prompt handling is complete.
 */
var promptHandler = function (prompt, userId, isDebug, results) {
    return __awaiter(this, void 0, void 0, function () {
        var result, promptType, fileURL, promptTr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = (0, result_object_1.getResultObjectByUser)(userId, results);
                    if (result === null) {
                        result = results[0];
                    }
                    return [4 /*yield*/, nlPromptType.getPromptType(prompt)];
                case 1:
                    promptType = _a.sent();
                    fileURL = '';
                    result.sql = '';
                    result.promptType = promptType;
                    promptTr = (0, clean_1.cleanPrompt)(prompt);
                    result.prompt = promptTr;
                    if (!(promptType === constants.QUESTION)) return [3 /*break*/, 3];
                    // Question prompt
                    result.pageNum = 1;
                    return [4 /*yield*/, handlers.questionHandler(result)];
                case 2:
                    result = _a.sent();
                    if (process.env.DEMO_MODE == "true") {
                        result = demoData.replaceDemoValues(result, result.entity.name);
                    }
                    _a.label = 3;
                case 3:
                    if (!(promptType === constants.LLM)) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, prompt_handler_utils_1.llmHandlerCall)(result)];
                case 4:
                    // LLM prompt
                    result = _a.sent();
                    _a.label = 5;
                case 5:
                    if (!(promptType === constants.EXCEL)) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, prompt_handler_utils_1.excelHandlerCall)(result)];
                case 6:
                    // Excel prompt
                    fileURL = _a.sent();
                    _a.label = 7;
                case 7:
                    if (!(promptType === constants.LINK)) return [3 /*break*/, 9];
                    return [4 /*yield*/, handlers.linkHandler(result)];
                case 8:
                    // Link prompt
                    result = _a.sent();
                    _a.label = 9;
                case 9:
                    if (!(promptType === constants.SORT)) return [3 /*break*/, 11];
                    return [4 /*yield*/, handlers.sortHandler(result)];
                case 10:
                    // Sort prompt
                    result = _a.sent();
                    _a.label = 11;
                case 11:
                    if (!(promptType === constants.PAGE)) return [3 /*break*/, 13];
                    if (!(result != null)) return [3 /*break*/, 13];
                    result.pageNum = handlers.pageHandler(result);
                    return [4 /*yield*/, savePrompt.savePrompt(result)];
                case 12:
                    _a.sent();
                    _a.label = 13;
                case 13:
                    if (!(promptType === constants.FILE)) return [3 /*break*/, 15];
                    if (!(result != null)) return [3 /*break*/, 15];
                    result.dispFields = [];
                    return [4 /*yield*/, handlers.filesHandler(result)];
                case 14:
                    result = _a.sent();
                    _a.label = 15;
                case 15:
                    if (!(promptType === constants.HELP)) return [3 /*break*/, 17];
                    if (!(result != null)) return [3 /*break*/, 17];
                    result.dispFields = [];
                    return [4 /*yield*/, help.getHelp(promptTr)];
                case 16:
                    result = _a.sent();
                    _a.label = 17;
                case 17:
                    if (!(promptType === constants.PROMPT)) return [3 /*break*/, 19];
                    if (!(result != null)) return [3 /*break*/, 19];
                    result.dispFields = [];
                    return [4 /*yield*/, promptsHistory.listHistory(result)];
                case 18:
                    result = _a.sent();
                    _a.label = 19;
                case 19:
                    if (promptType != constants.QUESTION && promptType != constants.PAGE) {
                        if (result != null) {
                            result.pageNum = 1;
                        }
                    }
                    if (!(result != null)) return [3 /*break*/, 21];
                    return [4 /*yield*/, savePrompt.savePrompt(result)];
                case 20:
                    _a.sent();
                    return [3 /*break*/, 22];
                case 21: throw new Error("Result is null.");
                case 22: 
                // Format the result
                // Call the formatResult function
                // let resultObject = await formatResult(result, userId, promptType, resultData, pageNum, isDebug);
                return [2 /*return*/, result];
            }
        });
    });
};
exports.promptHandler = promptHandler;
