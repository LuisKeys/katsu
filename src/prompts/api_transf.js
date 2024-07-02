"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfResAPI = void 0;
var format_api_result_1 = require("../formatter/format_api_result");
var api_transf_utils_1 = require("./api_transf_utils");
/**
 * Transforms the result object into a desired output format suitable for the API.
 * @param {Object} resultObject - The result object to be transformed.
 * @returns {Object} - The transformed output object.
 */
var transfResAPI = function (resultObject) {
    var output = (0, api_transf_utils_1.getAPIOutput)(resultObject);
    if (resultObject.rows.length == 0) {
        output.rows = [];
    }
    else {
        output = (0, api_transf_utils_1.transfResultObj)(resultObject, output);
        output = (0, format_api_result_1.formatAPIResult)(output);
        return output;
    }
    return output;
};
exports.transfResAPI = transfResAPI;
