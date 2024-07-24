import { convResultObjToCSV } from "../../result/result_object";
import { KatsuState } from "../../state/katsu_state";

const createFormatResultPrompt = (state: KatsuState, userIndex: number): string => {
  const csv = convResultObjToCSV(state, userIndex);
  const llmPrompt = `format the result in the following CSV format to a nice human readable paragraph: 
  ${csv}`;
  return llmPrompt;
}

export { createFormatResultPrompt };