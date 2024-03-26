// Required External Modules
require("dotenv").config();
const nl2sql = require("./src/nl2sql/translate");
const nlPromptType = require("./src/nl/prompt_type");
const OpenAI = require("openai");
const openAIAPI = require("./src/openai/openai_api");
const db = require("./src/db/db_commands");
const formatTable = require("./src/formatter/format_result");
const excel = require("./src/excel/create_excel");

openai = new OpenAI();

// Testing block
const promptHandler = async (prompt) => {    
  const promptType = nlPromptType.getPromptType(prompt);  
  let sql = '';  
  let result;

  if (promptType === 'question') {    
    sql = await nl2sql.generateSQL(openai, openAIAPI, prompt);
    await db.connect();
  } else if (promptType === 'file') {
    // TODO Write the file
  } else if (promptType === 'link') {

    await db.connect();
    result = await db.execute('SELECT words FROM links');
    sql = await nl2sql.getLinkSQL(prompt, result.rows);
  } else if (promptType === 'help') {
    // TODO Show help
  }

  result = await db.execute(sql);
  await db.close();  
  console.log('SQL:');
  console.log(sql);
  formatTable.getTableFromResult(result);  
  excel.createExcel(result);
}

module.exports = { promptHandler };