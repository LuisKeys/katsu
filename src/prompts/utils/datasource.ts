import { askAI } from "../../llm/openai/openai_api";
import { Datasource, KatsuState, User } from "../../state/katsu_state";
import { createDatasourcePrompt } from "../../llm/prompt_generators/data_source_gen";

const getDataSource = async (userState: User, datasources: Datasource[], state: KatsuState) => {
  if (state.datasources.length === 1) {
    userState.dataSourceIndex = 0;
  } else {
    userState.context = createDatasourcePrompt(userState, datasources);
    const response = await askAI(state, userState.context);
    userState.dataSourceIndex = datasources.findIndex(dataSource => dataSource.datasourceName === response);
  }
}

export { getDataSource };