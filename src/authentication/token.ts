import * as jwt from 'jsonwebtoken';

/**
 * Generates a token using the provided payload.
 *
 * @param {object} payload - The payload to be included in the token.
 * @returns {string} The generated token.
 */
function generateToken(user: string): string {
  const secretKey: string = String(process.env.AUTH_SECRET_KEY);
  const expiresIn = '100h';
  return jwt.sign({ user }, secretKey, { expiresIn });
}

/**
 * Validates a token using the provided secret key.
 * @param {string} token - The token to be validated.
 * @returns {boolean} - Returns true if the token is valid, false otherwise.
 */
function validateToken(token: string): boolean {
  try {
    const secretKey: string = String(process.env.AUTH_SECRET_KEY);
    jwt.verify(token, secretKey);
    return true;
  } catch (error) {
    return false;
  }
}

declare module 'jsonwebtoken' {
  export interface UserIDJwtPayload extends JwtPayload {
    user: string
  }
}

/**
 * Retrieves the payload from a token.
 * @param {string} token - The token from which to retrieve the payload.
 * @returns {object|null} - The payload object if the token is valid, null otherwise.
 */
function getPayloadFromToken(token: string): string {
  try {
    const secretKey = process.env.AUTH_SECRET_KEY;
    const decoded = <jwt.UserIDJwtPayload>jwt.verify(token, secretKey as jwt.Secret);
    return decoded.user;
  } catch (error) {
    return "";
  }
}

export { generateToken, getPayloadFromToken, validateToken };
