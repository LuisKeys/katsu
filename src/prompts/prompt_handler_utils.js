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
exports.llmHandlerCall = exports.formatResult = exports.excelHandlerCall = void 0;
var excel = require("../excel/create_excel");
var handlers = require("./handlers");
var pageCalc = require("./page_calc");
var savePrompt = require("./save_prompt");
/**
 * Handles the llmHandler call.
 *
 * @param {string} promptTr - The prompt transaction.
 * @param {string} memberId - The member ID.
 * @param {string} memberName - The member name.
 * @returns {Promise<[string, any]>} - A promise that resolves to an array containing the file URL and the result object.
 */
var llmHandlerCall = function (result) { return __awaiter(void 0, void 0, void 0, function () {
    var fileURL;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                result.dispFields = [];
                result.rows = [];
                return [4 /*yield*/, handlers.llmHandler(result.prompt)];
            case 1:
                fileURL = _a.sent();
                return [4 /*yield*/, savePrompt.savePrompt(result)];
            case 2:
                _a.sent();
                result.fileURL = fileURL;
                return [2 /*return*/, result];
        }
    });
}); };
exports.llmHandlerCall = llmHandlerCall;
/**
 * Handles the Excel handler call.
 *
 * @param {string} promptTr - The prompt transaction.
 * @param {number} memberId - The member ID.
 * @param {string} memberName - The member name.
 * @returns {string} - The file URL.
 */
var excelHandlerCall = function (result) { return __awaiter(void 0, void 0, void 0, function () {
    var fileURL;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fileURL = "";
                if (!(result.rows.length > 0)) return [3 /*break*/, 2];
                fileURL = excel.createExcel(result);
                return [4 /*yield*/, savePrompt.savePrompt(result)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/, fileURL];
        }
    });
}); };
exports.excelHandlerCall = excelHandlerCall;
/**
 * Formats the result based on the provided parameters.
 *
 * @param {Object} result - The result object.
 * @param {string} memberId - The member ID.
 * @param {string} promptType - The prompt type.
 * @param {Object} resultData - The result data object.
 * @param {number} pageNum - The page number.
 * @param {boolean} isDebug - Indicates whether debug mode is enabled.
 * @returns {Object} - The formatted result object.
 */
var formatResult = function (result) {
    var pageSize = Number(process.env.PAGE_SIZE);
    var resultObject = {};
    var lastPage = 1;
    var messages = [];
    if (result && result.rows.length > 0) {
        // Data found
        if (result.rows.length > pageSize) {
            lastPage = pageCalc.getLastPage(result);
        }
        return resultObject;
    }
    ;
    return resultObject;
};
exports.formatResult = formatResult;
