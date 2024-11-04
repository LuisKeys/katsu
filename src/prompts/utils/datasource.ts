import { ask } from "../../llm/openai/openai_api";
import { KatsuState } from "../../state/katsu_state";
import { createDatasourcePrompt } from "../../llm/prompt_generators/data_source_gen";

const getDataSource = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {
  if (state.datasources.length === 1) {
    state.users[userIndex].dataSourceIndex = 0;
    return state;
  } else {
    let context = createDatasourcePrompt(state, userIndex);
    state.users[userIndex].context = context;
    const response = await ask(state, userIndex);
    state.users[userIndex].dataSourceIndex = state.datasources.findIndex(dataSource => dataSource.datasourceName === response);
    return state;
  }
}

export { getDataSource };