import { convResultObjToCSV, UserResult } from "../../result/result_object";

const createFormatResultPrompt = (userResult: UserResult): string => {
  const csv = convResultObjToCSV(userResult);
  const llmPrompt = `format the result in the following CSV format to a nice human readable short paragraph: 
  ${csv}
  Avoid the references to your model training data, date, etc.
  `;
  return llmPrompt;
}

//TODO Remove
// const createFormatFieldsNamesPrompt = (fields: String[]): string => {
//   const csv = fields.join(",");
//   const llmPrompt = `Provide more human readable names for the following list of fields:  
//   ${csv}
//   Return the new names as a comma separated list. 
//   `;
//   return llmPrompt;
// }

export { createFormatResultPrompt };