"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceDemoValues = void 0;
var people_data_1 = require("./people_data");
var company_data_1 = require("./company_data");
/**
 * Replaces demo values in the table data.
 * @param {Array<Array<string>>} result - The table data to modify.
 * @param {string} entityName - The name of the entity.
 * @returns {Array<Array<string>>} - The modified table data.
 */
var replaceDemoValues = function (result, entityName) {
    if (result) {
        var fieldNames = result.fields;
        var lastNameIndex = fieldNames.findIndex(function (field) { return field === "lastname"; });
        var firstNameIndex = fieldNames.findIndex(function (field) { return field === "firstname"; });
        var fullNameIndex = fieldNames.findIndex(function (field) { return field === "full_name"; });
        var nameIndex = fieldNames.findIndex(function (field) { return field === "name"; });
        var customerNameIndex = fieldNames.findIndex(function (field) { return field === "customer_name"; });
        var companyIndex = fieldNames.findIndex(function (field) { return field === "company"; });
        var emailFields = [];
        for (var i = 0; i < fieldNames.length; i++) {
            if (fieldNames[i].includes("email")) {
                emailFields.push(fieldNames[i]);
            }
        }
        var phoneFields = [];
        for (var i = 0; i < fieldNames.length; i++) {
            if (fieldNames[i].includes("phone")) {
                phoneFields.push(fieldNames[i]);
            }
        }
        var amountFields = [];
        for (var i = 0; i < fieldNames.length; i++) {
            if (fieldNames[i].includes("amount")) {
                amountFields.push(fieldNames[i]);
            }
        }
        for (var i = 0; i < result.rows.length; i++) {
            var lastName = (0, people_data_1.getLastName)();
            var firstName = (0, people_data_1.getFirstName)();
            var companyName = (0, company_data_1.getCompanyName)();
            var email = (0, company_data_1.getEmail)(firstName, lastName, companyName);
            var phone = (0, people_data_1.getPhone)();
            var amount = (0, company_data_1.getAmount)();
            if (lastNameIndex !== -1) {
                result.rows[i][lastNameIndex] = lastName;
            }
            if (firstNameIndex !== -1) {
                result.rows[i][firstNameIndex] = firstName;
            }
            if (emailFields.length > 0) {
                for (var j = 0; j < emailFields.length; j++) {
                    result.rows[i][fieldNames.indexOf(emailFields[j])] = email;
                }
            }
            if (phoneFields.length > 0) {
                for (var j = 0; j < phoneFields.length; j++) {
                    result.rows[i][fieldNames.indexOf(phoneFields[j])] = phone;
                }
            }
            if (fullNameIndex !== -1) {
                result.rows[i][fullNameIndex] = "".concat(firstName, " ").concat(lastName);
            }
            if (companyIndex !== -1) {
                result.rows[i][companyIndex] = companyName;
            }
            if (nameIndex !== -1) {
                var name_1 = "".concat(firstName, " ").concat(lastName);
                if (entityName === "company" || entityName === "engagement") {
                    name_1 = companyName;
                }
                result.rows[i][nameIndex] = name_1;
            }
            if (customerNameIndex !== -1 && entityName === "project_role") {
                result.rows[i][customerNameIndex] = companyName;
            }
            if (amountFields.length > 0) {
                for (var j = 0; j < amountFields.length; j++) {
                    result.rows[i][fieldNames.indexOf(amountFields[j])] = amount;
                }
            }
        }
        return result;
    }
    else {
        return result;
    }
};
exports.replaceDemoValues = replaceDemoValues;
