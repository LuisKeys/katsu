import { resetResult } from "../../result/result_object";
import { KatsuState } from "../../state/katsu_state";

const helpHandler = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {
  const userState = state.users[userIndex];
  resetResult(userState);

  const helpList = state.dataSources[userState.dataSourceIndex].helpList;
  const result = userState.result;

  result.text = "Sample prompts:";
  for (const helpItem of helpList) {
    result.text += `\n- ${helpItem}\n`;
  }
  return state;
};

export {
  helpHandler
};
