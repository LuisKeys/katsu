"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.getPayloadFromToken = getPayloadFromToken;
exports.validateToken = validateToken;
var jsonwebtoken_1 = require("jsonwebtoken");
/**
 * Generates a token using the provided payload.
 *
 * @param {object} payload - The payload to be included in the token.
 * @returns {string} The generated token.
 */
function generateToken(user) {
    var secretKey = String(process.env.AUTH_SECRET_KEY);
    var expiresIn = '1h';
    return jsonwebtoken_1.default.sign({ user: user }, secretKey, { expiresIn: expiresIn });
}
/**
 * Validates a token using the provided secret key.
 * @param {string} token - The token to be validated.
 * @returns {boolean} - Returns true if the token is valid, false otherwise.
 */
function validateToken(token) {
    try {
        var secretKey = String(process.env.AUTH_SECRET_KEY);
        jsonwebtoken_1.default.verify(token, secretKey);
        return true;
    }
    catch (error) {
        return false;
    }
}
/**
 * Retrieves the payload from a token.
 * @param {string} token - The token from which to retrieve the payload.
 * @returns {object|null} - The payload object if the token is valid, null otherwise.
 */
function getPayloadFromToken(token) {
    try {
        var secretKey = String(process.env.AUTH_SECRET_KEY);
        var decoded = jsonwebtoken_1.default.verify(token, secretKey);
        return decoded;
    }
    catch (error) {
        return null;
    }
}
