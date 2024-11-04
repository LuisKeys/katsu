import { connectMetadataDB } from "../../db/db_commands";
import { getUserAuthorizedTables } from "../../security";
import { DataSource as Datasource, KatsuState, User } from "../../state/katsu_state";

const helpHandler = async (userState: User, datasources: Datasource[]) => {
  const client = connectMetadataDB();
  if (client === null) throw new Error("Failed to connect to metadata DB."); // TODO move to connectMetadataDB?

  const userAuthorizedTables = await getUserAuthorizedTables(userState.userId);
  let help = '';

  for (const datasource of datasources) {
    let tableList = '';
    for (const table of datasource.tables) {
      const some = userAuthorizedTables.some(([name, tableName]) => name === datasource.datasourceName && tableName === table);
      if (some) tableList += `${table}, `;
    }

    if (tableList !== '') {
      help += `\n\n- **${datasource.datasourceName.toUpperCase()}**: ${tableList.slice(0, -2).toTitleCase()}.`;
    }
  }

  userState.result.text = help === ''
    ? 'No authorized data sources found. Please contact your administrator.'

    : 'Creating effective prompts is key to getting accurate. Here are some best practices.\n'
    + '\n- Be Clear and Specific.'
    + '\n- Avoid long prompts.'
    + '\n- Try to reference the data source name your are looking information from.'
    + '\n### **Data Sources**\n\n'
    + help;

  // TODO add help for each table?
  // const sql = `SELECT sample_prompt FROM help WHERE datasource_name = '${dataSource.datasourceName}' ORDER BY sample_prompt asc`;
  // const result = await execute(sql, client);
  // return result === null ? [] : result.rows.map(prompt => prompt.sample_prompt);
}

// TODO remove
// function toTitleCase(text: string): string {
//   return text
//     // Replace underscores with spaces, split by spaces
//     .replace(/_/g, ' ')
//     .toLowerCase()
//     // Capitalize the first letter of each word
//     .replace(/\b\w/g, (char) => char.toUpperCase());
// }

// const helpHandlerOld = (userState: User, datasources: Datasource[]) => {
//   resetResult(userState);

//   const helpList = datasources[userState.dataSourceIndex].helpList;
//   const result = userState.result;

//   result.text = "Sample prompts:";
//   for (const helpItem of helpList) {
//     result.text += `\n- ${helpItem}\n`;
//   }
// };

export {
  helpHandler
};
