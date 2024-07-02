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
exports.getLinkSQL = exports.generateSQL = void 0;
var entity_finder_1 = require("./entity_finder");
var dbFields = require("../db/db_get_fields");
var openAIAPI = require("../openai/openai_api");
/**
 * This module contains functions for generating SQL statements based on user prompts.
 * @module nl2sql/translate
 */
/**
 * Retrieves the SQL statement for retrieving links based on the given prompt and rows.
 * @param {string} prompt - The prompt to be used for searching links.
 * @param {Array} rows - The rows containing words to be matched with the prompt.
 * @returns {string} The SQL statement for retrieving links.
 */
var getLinkSQL = function (prompt, rows) {
    var sql = '';
    if (rows) {
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var words = row.words.split(',');
            for (var j = 0; j < words.length; j++) {
                if (prompt.includes(words[j])) {
                    sql = "SELECT name, url as link FROM links where words like '%" + words[j] + "%' order by name";
                }
            }
        }
    }
    return sql;
};
exports.getLinkSQL = getLinkSQL;
var generateSQL = function (openai, result) {
    return __awaiter(this, void 0, void 0, function () {
        var entities, entity, fields, fullPrompt, sql;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, entity_finder_1.getEntities)(result.prompt)];
                case 1:
                    entities = _a.sent();
                    if (entities.length == 0) {
                        return [2 /*return*/, result];
                    }
                    entity = entities[0];
                    return [4 /*yield*/, dbFields.getViewFields(entity.view)];
                case 2:
                    fields = _a.sent();
                    fullPrompt = getPrompt(entity.view, fields, result.prompt);
                    return [4 /*yield*/, openAIAPI.ask(openai, fullPrompt)];
                case 3:
                    sql = _a.sent();
                    sql = sanitizeSQL(sql);
                    sql = replaceEqualityWithLike(sql);
                    result.sql = sql;
                    result.dispFields = entity.dispFields;
                    result.entity = entity;
                    return [2 /*return*/, result];
            }
        });
    });
};
exports.generateSQL = generateSQL;
/**
 * Replaces equality comparisons in the SQL string with LIKE comparisons.
 *
 * @param {string} sql - The SQL string to modify.
 * @returns {string} The modified SQL string.
 */
var replaceEqualityWithLike = function (sql) {
    var pattern = /lower\((.*?)\) = '(.*?)'/g;
    var replacement = "lower($1) like '%$2%'";
    sql = sql.replace(pattern, replacement);
    return sql;
};
/**
 * Sanitizes the given SQL string by removing unwanted characters and converting it to lowercase.
 *
 * @param {string} sql - The SQL string to sanitize.
 * @returns {string} The sanitized SQL string.
 */
var sanitizeSQL = function (sql) {
    sql = sql.replace("```", " ");
    sql = sql.replace("sql", " ");
    sql = sql.replace("\n", " ");
    sql = sql.trim();
    sql = sql.toLowerCase();
    return sql;
};
/**
 * Generates the prompt for the SQL statement based on the entity, fields, and user prompt.
 * @param {object} openai - The OpenAI object.
 * @param {string} entity - The entity for the SQL statement.
 * @param {Array} fields - The fields to be included in the WHERE statement.
 * @param {string} userPrompt - The user prompt for the SQL statement.
 * @returns {string} The generated prompt for the SQL statement.
 */
var getPrompt = function (entity, fields, userPrompt) {
    var prompt = '';
    prompt += "Create a SELECT statement for PostgreSql to retrieve data from the " + entity + " table.";
    if (userPrompt.includes("number of")) {
        prompt += " Count the number of rows.";
    }
    prompt += "Only if it applies include the following fields to define the where statement: ";
    for (var i = 0; i < fields.length; i++) {
        prompt += fields[i] + ", ";
        if (i === fields.length - 1) {
            prompt += fields[i] + ".";
        }
    }
    prompt += " based on the following user prompt: " + userPrompt;
    prompt += " If there is a where clause use the lower() function to compare string fields.";
    prompt += " Limit the results to 100 rows.";
    prompt += " Answer only with the SQL statement.";
    return prompt;
};
var createReflectionPrompt = function (prompt, error, origPrompt) {
    var reflectionPrompt = "";
    if (error != "") {
        reflectionPrompt = "This is the original prompt:.\n";
        reflectionPrompt += origPrompt + "\n";
        reflectionPrompt += "The query you provided was wrong.\n";
        reflectionPrompt += "Here is the error message:\n";
        reflectionPrompt += error + "\n";
        reflectionPrompt += "Try again with a different query.";
    }
    else {
        reflectionPrompt = "This is the original prompt:.\n";
        reflectionPrompt += origPrompt + "\n";
        reflectionPrompt += "The query you provided did not return any results.\n";
        reflectionPrompt += "Try again with a different query using a related different field in the 'where' statement.";
        reflectionPrompt += "For example if 'firstname' was used try with 'lastname'.";
    }
    return reflectionPrompt;
};
