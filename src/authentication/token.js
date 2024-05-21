const jwt = require('jsonwebtoken');

/**
 * Generates a token using the provided payload.
 *
 * @param {object} payload - The payload to be included in the token.
 * @returns {string} The generated token.
 */
function generateToken(user) {
  secretKey = process.env.AUTH_SECRET_KEY;
  const expiresIn = '1h';
  return jwt.sign({user:user}, secretKey, { expiresIn });
}

/**
 * Validates a token using the provided secret key.
 * @param {string} token - The token to be validated.
 * @returns {boolean} - Returns true if the token is valid, false otherwise.
 */
function validateToken(token) {
  try {
    secretKey = process.env.AUTH_SECRET_KEY;
    jwt.verify(token, secretKey);    
    return true;
  } catch (error) {
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
    secretKey = process.env.AUTH_SECRET_KEY;
    const decoded = jwt.verify(token, secretKey);
    return decoded.user;
  } catch (error) {
    return null;
  }
}

module.exports = { generateToken, getPayloadFromToken, validateToken };