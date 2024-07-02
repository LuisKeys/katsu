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
Object.defineProperty(exports, "__esModule", { value: true });
exports.exploreFolder = exploreFolder;
exports.searchFiles = searchFiles;
exports.copyFilesToReports = copyFilesToReports;
var fs_1 = require("fs");
var path_1 = require("path");
var crypto_1 = require("crypto");
/**
 * Explores a folder and returns a list of files in the directory.
 * @param {string} directory - The path of the directory to explore.
 * @returns {Array<Object>} - An array of file objects containing information about each file.
 */
function exploreFolder(directory) {
    var files = (0, fs_1.readdirSync)(directory);
    var fileList = [];
    var root = process.env.FILES_FOLDER;
    files.forEach(function (file) {
        var filePath = (0, path_1.join)(directory, file);
        var stats = (0, fs_1.statSync)(filePath);
        if (stats.isFile()) {
            var relFilePath = filePath.replace(root, "");
            var fileObj = {
                fileName: file,
                extension: (0, path_1.extname)(file),
                size: stats.size,
                date: stats.mtime,
                relativePath: relFilePath,
                urlPath: ""
            };
            fileList.push(fileObj);
        }
        else if (stats.isDirectory()) {
            var subFiles = exploreFolder(filePath);
            fileList.push.apply(fileList, subFiles);
        }
    });
    return fileList;
}
/**
 * Searches for files in the given list that contain at least two words from the prompt.
 * @param {Array<Object>} files - The list of file objects to search through.
 * @param {Array<string>} words - The list of words to search for.
 * @returns {Array<string>} - An array of file names that match the search criteria.
 */
function searchFiles(files, words) {
    var searchResults = [];
    files.forEach(function (file) {
        var fileName = file.fileName.toLowerCase();
        var promptWords = words.map(function (word) { return word.toLowerCase(); });
        var count = 0;
        for (var i = 0; i < promptWords.length; i++) {
            if (fileName.includes(promptWords[i])) {
                count++;
            }
        }
        var containsWords = count >= 1;
        if (containsWords) {
            searchResults.push(file);
        }
    });
    return searchResults;
}
/**
 * Copies files to the specified folder and updates the URL path.
 * @param {Array<Object>} files - The list of file objects to copy.
 * @returns {Array<Object>} - An array of file objects with updated URL paths.
 */
function copyFilesToReports(files) {
    var copyFolder = process.env.FILES_COPY_FOLDER;
    var reportsUrl = process.env.REPORTS_URL;
    var filesFolder = process.env.FILES_FOLDER;
    var updatedFiles = [];
    files.forEach(function (file) {
        var _a = file, fileName = _a.fileName, extension = _a.extension, relativePath = _a.relativePath, urlPath = _a.urlPath;
        var fullPath = filesFolder + relativePath;
        var fileData = (0, fs_1.readFileSync)(fullPath);
        var hash = crypto_1.default.createHash('md5').update(fileName).digest('hex');
        var newFileName = "".concat(hash).concat(extension);
        var newPath = (0, path_1.join)(copyFolder, newFileName);
        (0, fs_1.writeFileSync)(newPath, fileData);
        var updatedUrlPath = "".concat(reportsUrl, "/").concat(newFileName);
        var updatedFile = __assign(__assign({}, file), { relativePath: newPath, urlPath: updatedUrlPath });
        updatedFiles.push(updatedFile);
    });
    return updatedFiles;
}
