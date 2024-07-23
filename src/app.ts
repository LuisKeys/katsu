import { apiApp } from "./api_app";
import { loadKatsuState } from "./state/load_state";
import { getOpenAI } from "./llm/openai/openai_api";
import { executeTest } from "./test/test";
require("dotenv").config();

const init = async () => {
  const openai = getOpenAI();
  const state = await loadKatsuState(openai)
  state.isDebug = process.env.KATSU_DEBUG === 'true';
  const isTest = process.env.IS_TEST === 'true';
  if (isTest) {
    executeTest(state);
  }

  // start the API server.
  apiApp(state);
}

init();
