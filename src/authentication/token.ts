import jwt from 'jsonwebtoken';

/**
 * Generates a token using the provided payload.
 *
 * @param {object} payload - The payload to be included in the token.
 * @returns {string} The generated token.
 */
function generateToken(user: string): string {
  const secretKey: string = String(process.env.AUTH_SECRET_KEY);
  const expiresIn = '1h';
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

/**
 * Retrieves the payload from a token.
 * @param {string} token - The token from which to retrieve the payload.
 * @returns {object|null} - The payload object if the token is valid, null otherwise.
 */
function getPayloadFromToken(token: string): object | null {
  try {


    const secretKey: String = String(process.env.AUTH_SECRET_KEY);
    const decoded: Object = jwt.verify(token, secretKey as jwt.Secret);
    return decoded;
  } catch (error) {
    return null;
  }
}

export { generateToken, getPayloadFromToken, validateToken };
