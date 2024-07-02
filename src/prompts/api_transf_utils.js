"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfResultObj = exports.getAPIOutput = void 0;
/**
 * Transforms the result object by extracting fields and generating rows.
 * @param {Object} resultObject - The result object to be transformed.
 * @param {Object} output - The output object to store the transformed result.
 * @returns {Object} The transformed output object.
 */
var transfResultObj = function (resultObject, output) {
    var dispFields = resultObject.dispFields;
    var rows = [];
    // Add header
    if (dispFields.length > 0) {
        rows = getRowsResDspFields(resultObject, dispFields);
    }
    else {
        rows = getRowsAllFields(resultObject);
    }
    output.fields = getFields(resultObject.fields);
    output.rows = rows;
    output.promptType = resultObject.promptType;
    output.docUrl = resultObject.docUrl;
    output.prompt = resultObject.prompt;
    output.requiresAnswer = resultObject.requiresAnswer;
    delete output.dispFields;
    return output;
};
exports.transfResultObj = transfResultObj;
var getFields = function (fields) {
    var newFields = [];
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        newFields.push(field.name);
    }
    return newFields;
};
var getRowsAllFields = function (resultObject) {
    var rows = [];
    // All the fields
    // Add header
    var header = [];
    var fields = resultObject.fields;
    for (var j = 0; j < fields.length; j++) {
        var field = fields[j];
        header.push(field.name);
    }
    rows.push(header);
    // Add rows
    for (var i = 0; i < resultObject.rows.length; i++) {
        var row = resultObject.rows[i];
        var newRow = [];
        for (var j = 0; j < fields.length; j++) {
            var field = fields[j];
            newRow.push(row[field.name]);
        }
        rows.push(newRow);
    }
    return rows;
};
var getRowsResDspFields = function (resultObject, dispFields) {
    var rows = [];
    // Display fields
    var header = [];
    for (var i = 0; i < dispFields.length; i++) {
        header.push(dispFields[i]);
    }
    rows.push(header);
    // Add rows
    for (var i = 0; i < resultObject.rows.length; i++) {
        var row = resultObject.rows[i];
        var newRow = [];
        var fields = resultObject.fields;
        for (var j = 0; j < fields.length; j++) {
            var field = fields[j];
            if (dispFields.includes(field.name)) {
                newRow.push(row[field.name]);
            }
        }
        rows.push(newRow);
    }
    return rows;
};
var getAPIOutput = function (resultObject) {
    var output = {};
    output.pageNum = resultObject.pageNum;
    output.lastPage = resultObject.lastPage;
    delete resultObject.table;
    delete resultObject.slackFields;
    return output;
};
exports.getAPIOutput = getAPIOutput;
