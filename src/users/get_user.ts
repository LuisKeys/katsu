import { KatsuState, User } from "../db/katsu_db/katsu_state";

/**
 * Checks if a user with the given email exists in the members table.
 * @param {string} email - The email of the user to check.
 * @returns {userID} - A promise that resolves to the member ID if the user exists, -1 otherwise.
 */
const getUser = (email: string, state: KatsuState): User | null => {
  for (const user of state.users) {
    if (user.email === email) {
      return user;
    }
  }

  return null;
}

export { getUser };
