const db = require("./db_commands");

const getViewFields = async function (entity) {
 
  let fields = [];

  db.connect();

  let sql = `SELECT a.attname FROM pg_class c `;
  sql += `INNER JOIN pg_attribute a ON a.attrelid = c.oid `;
  sql += `INNER JOIN pg_type t ON t.oid = a.atttypid `;
  sql += `WHERE c.relkind = 'v' `;
  sql += `AND c.relname = '${entity.view}'`;
 

let result = await db.execute(sql);

  for (let i = 0; i < result.rows.length; i++) {
    fields.push(result.rows[i].attname);
  }

  db.close();

  return fields;
}

module.exports = { getViewFields };