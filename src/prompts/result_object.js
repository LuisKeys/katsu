import { ask } from "../openai/openai_api";
import openAI from "openai";
/**
 * @fileoverview This module exports two functions: getResultObject and render.
 * getResultObject creates a result object with the given result and messages.
 * render takes a result object and returns a formatted output string.
 * @module result_object
 */
const openai = new openAI();
/**
 * Creates a new result object.
 *
 * @param {*} result - The result value.
 * @param {Array} messages - An array of messages.
 * @param {string} promptType - The type of prompt.
 * @param {boolean} isDebug - Indicates if debug mode is enabled.
 * @returns {Object} - The result object containing the result and messages.
 */
const getNewResultObject = function () {
    const resultObject = {
        dispFields: [],
        entity: { name: "", view: "", dispFields: [] },
        fields: [],
        pageNum: 0,
        promptType: "",
        requiresAnswer: false,
        rows: [],
        sql: "",
        table: "",
        text: "",
        userId: 0,
        fileURL: "",
        prompt: "",
        lastPage: 0
    };
    return resultObject;
};
const getResultObjectsBuffer = function (size) {
    let resultObjects = [];
    for (let i = 0; i < size; i++) {
        resultObjects.push(getNewResultObject());
    }
    return resultObjects;
};
const getResultObjectByUser = function (userId, results) {
    for (let i = 0; i < results.length; i++) {
        if (results[i].userId === userId) {
            return results[i];
        }
    }
    for (let i = 0; i < results.length; i++) {
        if (results[i].userId === 0) {
            results[i].userId = userId;
            return results[i];
        }
    }
    return results[0];
};
const setResultObjectByUser = function (userId, result, results) {
    for (let i = 0; i < results.length; i++) {
        if (results[i].userId === userId) {
            results[i] = result;
        }
    }
    return results;
};
const getAnswer = async function (table) {
    let prompt = "convert the following tabular result into a friendly text in one short paragraph:";
    prompt += table;
    let answer = await ask(openai, prompt);
    return answer;
};
const convSqlResToResultObject = function (sqlRes, result) {
    result.fields = [];
    if (sqlRes !== null) {
        for (let i = 0; i < sqlRes.fields.length; i++) {
            result.fields.push(sqlRes.fields[i].name);
        }
        result.rows = sqlRes.rows;
    }
    return result;
};
export { convSqlResToResultObject, getNewResultObject, getResultObjectsBuffer, getResultObjectByUser, setResultObjectByUser };
