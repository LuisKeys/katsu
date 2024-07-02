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
exports.cleanEmptyDirs = cleanEmptyDirs;
exports.cleanFiles = cleanFiles;
exports.cleanReports = cleanReports;
var fs_1 = require("fs");
var path_1 = require("path");
var extensions_1 = require("./extensions");
/**
 * @fileOverview This module provides a function to clean up old reports from a specified folder.
 * @module clean
 */
/**
 * Cleans up old reports from a specified folder.
 */
function cleanReports() {
    var directory = String(process.env.REPORTS_FOLDER);
    var files = fs_1.default.readdirSync(directory);
    files.forEach(function (file) {
        var filePath = path_1.default.join(directory, file);
        var stats = fs_1.default.statSync(filePath);
        var now = new Date().getTime();
        var endTime = new Date(stats.ctime).getTime() + 30000;
        if (now > endTime) {
            fs_1.default.unlinkSync(filePath);
        }
    });
}
/**
 * Deletes all files with extensions different from the provided list, recursively for all folders.
 * @param {string} directory - The root directory to start the deletion process.
 */
function cleanFiles(directory) {
    return __awaiter(this, void 0, void 0, function () {
        var files, allowedExtensions;
        return __generator(this, function (_a) {
            files = fs_1.default.readdirSync(directory);
            allowedExtensions = (0, extensions_1.getExtWithDot)(extensions_1.validExtensions);
            files.forEach(function (file) {
                var filePath = path_1.default.join(directory, file);
                var stats = fs_1.default.statSync(filePath);
                if (stats.isDirectory()) {
                    cleanFiles(filePath);
                }
                else {
                    var fileExtension = path_1.default.extname(file).toLowerCase();
                    if (!allowedExtensions.includes(fileExtension)) {
                        fs_1.default.unlinkSync(filePath);
                        //console.log(`File ${filePath} has an invalid extension and will be deleted.`);
                    }
                }
            });
            return [2 /*return*/];
        });
    });
}
/**
 * Deletes all empty folders recursively from the specified directory.
 * @param {string} directory - The root directory to start the deletion process.
 */
function cleanEmptyDirs(directory) {
    var files = fs_1.default.readdirSync(directory);
    files.forEach(function (file) {
        var filePath = path_1.default.join(directory, file);
        var stats = fs_1.default.statSync(filePath);
        if (stats.isDirectory()) {
            cleanEmptyDirs(filePath);
            // Check if the directory is empty after deleting its contents
            var isEmpty = fs_1.default.readdirSync(filePath).length === 0;
            if (isEmpty) {
                fs_1.default.rmdirSync(filePath);
            }
        }
    });
}
