import { KatsuState } from '../db/katsu_db/katsu_state';
import bcrypt from 'bcrypt';

/**
 * Authenticates a user by comparing the provided email and password with the users in the application state.
 * @param email - The email of the user to authenticate.
 * @param password - The password of the user to authenticate.
 * @param state - The application state containing the list of users.
 * @returns A boolean indicating whether the authentication was successful.
 */
const authUser = function (email: string, password: string, state: KatsuState): boolean {
  const encPass = encryptPassword(password);
  for (const user of state.users) {
    if (user.email === email) {
      return user.password === encPass;
    }
  }

  return false;
}

/**
 * Encrypts a password using bcrypt.
 * 
 * @param password - The password to be encrypted.
 * @returns The hashed password.
 */
const encryptPassword = function (password: string): string {
  const key = process.env.AUTH_SALT as string;
  const hashedPassword = bcrypt.hashSync(password, key);

  return hashedPassword;
};

export { authUser, encryptPassword };

