import { KatsuState, User } from "../state/katsu_state";

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

/**
 * Returns the index of the user with the specified email in the given KatsuState.
 * @param email - The email of the user to find.
 * @param state - The KatsuState object containing the list of users.
 * @returns The index of the user if found, otherwise null.
 */
const getUserIndex = (email: string, state: KatsuState): number => {
  for (let i = 0; i < state.users.length; i++) {
    const user = state.users[i];
    if (user.email === email) {
      return i;
    }
  }

  return -1;
}

export { getUser, getUserIndex };
