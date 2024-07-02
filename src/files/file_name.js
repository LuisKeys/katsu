"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomFileName = void 0;
/**
 * Generates a unique filename for the Excel file based on the current date and time.
 * @param extension The file extension.
 * @returns The generated filename.
 */
var randomFileName = function (extension) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();
    var random = Math.floor(Math.random() * 1000);
    return "katsu_report_".concat(year, "_").concat(month, "_").concat(day, "_").concat(hours, "_").concat(minutes, "_").concat(seconds, "_").concat(milliseconds, "_").concat(random, ".").concat(extension);
};
exports.randomFileName = randomFileName;
