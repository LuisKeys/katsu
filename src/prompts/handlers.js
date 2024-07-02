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
exports.pageHandler = exports.llmHandler = exports.filesHandler = exports.sortHandler = exports.linkHandler = exports.questionHandler = void 0;
var constants = require("./constants");
var db = require("../db/db_commands");
var dbSortResult = require("../db/sort_result");
var filesClean = require("../files/clean");
var files_index_1 = require("../files/files_index");
var finder = require("../nl/entity_finder");
var nl2sql = require("../nl/translate");
var openAIAPI = require("../openai/openai_api");
var pageCalc = require("./page_calc");
var pageNL = require("../nl/page");
var sortFieldFinder = require("../nl/sort_field_finder");
var word = require("../word/create_word");
var openai_1 = require("openai");
var result_object_1 = require("./result_object");
/**
 * This module contains the handlers for different prompts types.
 * @module handlers
 */
var openai = new openai_1.default();
/**
 * Handles the question prompt.
 * @async
 * @param {string} prompt - The question prompt.
 * @returns {Promise} - A promise that resolves to the result of the database query.
 */
var questionHandler = function (result) { return __awaiter(void 0, void 0, void 0, function () {
    var entities;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                result.sql = "";
                result.requiresAnswer = true;
                return [4 /*yield*/, finder.getEntities(result.prompt)];
            case 1:
                entities = _a.sent();
                if (!(entities.length === 1)) return [3 /*break*/, 3];
                return [4 /*yield*/, getSQL(result)];
            case 2:
                result = _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, result];
        }
    });
}); };
exports.questionHandler = questionHandler;
var getSQL = function (result) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, nl2sql.generateSQL(openai, result)];
            case 1:
                result = _a.sent();
                console.log(result.sql);
                return [2 /*return*/, result];
        }
    });
}); };
/**
 * Handles the LLM prompt.
 *
 * @param {string} prompt - The prompt to be sent to the OpenAI API.
 * @returns {Promise<any>} - A promise that resolves to the result of the OpenAI API call.
 */
var llmHandler = function (prompt) { return __awaiter(void 0, void 0, void 0, function () {
    var finalPrompt, result, url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                finalPrompt = prompt;
                finalPrompt +=
                    "Format the output for a word document,  including '\n' char for new lines. Provide only the answer without any additional introduction or conclusion.";
                return [4 /*yield*/, openAIAPI.ask(openai, finalPrompt)];
            case 1:
                result = _a.sent();
                url = "";
                if (!(result.length > 100)) return [3 /*break*/, 3];
                return [4 /*yield*/, word.createWord(result)];
            case 2:
                url = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                url = result;
                _a.label = 4;
            case 4: return [2 /*return*/, url];
        }
    });
}); };
exports.llmHandler = llmHandler;
/**
 * Handles the link prompt.
 * @async
 * @param {string} prompt - The link prompt.
 * @returns {Promise} - A promise that resolves to the result of the database query.
 */
var linkHandler = function (result) { return __awaiter(void 0, void 0, void 0, function () {
    var sqlRes, sql;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db.connect()];
            case 1:
                _a.sent();
                if (!(result !== null && result.prompt.includes(constants.ALL))) return [3 /*break*/, 3];
                return [4 /*yield*/, db.execute("SELECT name, URL FROM links order by name")];
            case 2:
                sqlRes = _a.sent();
                return [3 /*break*/, 6];
            case 3: return [4 /*yield*/, db.execute("SELECT words FROM links")];
            case 4:
                sqlRes = _a.sent();
                if (!(result !== null && sqlRes !== null)) return [3 /*break*/, 6];
                sql = nl2sql.getLinkSQL(result.prompt, sqlRes.rows);
                return [4 /*yield*/, db.execute(sql)];
            case 5:
                sqlRes = _a.sent();
                _a.label = 6;
            case 6: return [4 /*yield*/, db.close()];
            case 7:
                _a.sent();
                if (sqlRes !== null && result !== null) {
                    result = (0, result_object_1.convSqlResToResultObject)(sqlRes, result);
                }
                return [2 /*return*/, result];
        }
    });
}); };
exports.linkHandler = linkHandler;
/**
 * Handles the sort prompt.
 * @async
 * @param {string} prompt - The sort prompt.
 * @param {object} result - The result object.
 * @returns {Promise} - A promise that resolves to the sorted result object.
 */
var sortHandler = function (result) { return __awaiter(void 0, void 0, void 0, function () {
    var sortFields, sortDir;
    return __generator(this, function (_a) {
        // Sort prompt
        if (result != null) {
            sortFields = sortFieldFinder.getSortfield(result);
            if (sortFields.length > 0) {
                sortDir = sortFieldFinder.getSortDirection(result.prompt);
                result.rows = dbSortResult.sortResult(result, sortFields, sortDir);
            }
        }
        return [2 /*return*/, result];
    });
}); };
exports.sortHandler = sortHandler;
var filesHandler = function (result) { return __awaiter(void 0, void 0, void 0, function () {
    var prompt, fullPrompt, words, wordsList, filesDir, files, searchedFiles, headerTitle, i, record;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                prompt = result.prompt;
                fullPrompt = "get the subject words for the prompt: '";
                fullPrompt += prompt;
                fullPrompt +=
                    "'.Only answer with a list of single words separated with comma.";
                fullPrompt += "Ignore the words file, files, doc, documents or similar";
                return [4 /*yield*/, openAIAPI.ask(openai, fullPrompt)];
            case 1:
                words = _a.sent();
                wordsList = words.split(",").map(function (word) { return word.trim(); });
                filesDir = process.env.FILES_FOLDER;
                files = (0, files_index_1.exploreFolder)(filesDir);
                searchedFiles = (0, files_index_1.searchFiles)(files, wordsList);
                filesClean.cleanReports();
                (0, files_index_1.copyFilesToReports)(searchedFiles);
                headerTitle = "Found_Files";
                result.fields = [];
                result.fields.push(headerTitle);
                for (i = 0; i < files.length; i++) {
                    record = {};
                    record[headerTitle] = files[i]["fileName"];
                    result.rows.push(record);
                    // URL
                    record = {};
                    record[headerTitle] = files[i]["urlPath"];
                    result.rows.push(record);
                    // separator
                    record = {};
                    record[headerTitle] = "----------------------------------------";
                    result.rows.push(record);
                }
                return [2 /*return*/, result];
        }
    });
}); };
exports.filesHandler = filesHandler;
/**
 * Handles the page prompt.
 *
 * @param {Object} prompt - The page prompt object.
 * @param {Object} result - The result object.
 * @returns {Promise<Object>} The updated result object.
 */
var pageHandler = function (result) {
    // Pages prompt
    if (result === null) {
        return 0;
    }
    var cmd = pageNL.getPageCommand(result.prompt);
    var page = 1;
    switch (cmd) {
        case pageNL.PAGE_LAST:
            page = pageCalc.getLastPage(result);
            break;
        case pageNL.PAGE_NEXT:
            page = pageCalc.getNextPage(result);
            break;
        case pageNL.PAGE_PREV:
            page = pageCalc.getPrevPage(result.pageNum);
            break;
        case pageNL.PAGE_NUMBER:
            page = pageNL.getPageNumber(result.prompt);
            if (page < 1) {
                page = 1;
            }
            if (page > pageCalc.getLastPage(result)) {
                page = pageCalc.getLastPage(result);
            }
            break;
        default:
            page = 1;
            break;
    }
    return page;
};
exports.pageHandler = pageHandler;
