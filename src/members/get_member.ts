import { QueryResult } from "pg";
import { connect, close, execute } from "../db/db_commands";

/**
 * Checks if a user with the given email exists in the members table.
 * @param {string} email - The email of the user to check.
 * @returns {Promise<number>} - A promise that resolves to the member ID if the user exists, -1 otherwise.
 */
const getUserId = async (email: string): Promise<number> => {
  const sql = `SELECT user_id FROM users WHERE email = '${email}'`;
  await connect();
  const result: QueryResult | null = await execute(sql);

  await close();

  if (result !== null && result.rows !== null && result.rows.length > 0) {
    return result.rows[0].user_id as number;
  }

  return -1;
}

export { getUserId };
