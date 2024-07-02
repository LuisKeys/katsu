import * as db from "./db_commands";
import { QueryResult } from 'pg';

/**
 * @file This module contains a function to retrieve the fields of a database view.
 * @module db_get_fields
 */


/**
 * Retrieves the fields of a database view.
 * @param {Object} entity - The entity object containing the view name.
 * @param {string} entity.view - The name of the view.
 * @returns {Array} - An array of field names.
 */
const getViewFields = async function (entityName: string): Promise<string[]> {
  let fields: string[] = [];

  db.connect();

  let sql = `SELECT a.attname FROM pg_class c `;
  sql += `INNER JOIN pg_attribute a ON a.attrelid = c.oid `;
  sql += `INNER JOIN pg_type t ON t.oid = a.atttypid `;
  sql += `WHERE c.relkind = 'v' `;
  sql += `AND c.relname = '${entityName}'`;

  let result: QueryResult | null = await db.execute(sql);

  if (result === null) {
    db.close();
    return fields;
  }

  for (let i = 0; i < result.rows.length; i++) {
    fields.push(result.rows[i].attname);
  }

  db.close();

  return fields;
}

export { getViewFields };
