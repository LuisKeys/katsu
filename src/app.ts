import { apiApp } from "./api_app";
import { loadKatsuState } from "./db/katsu_db/katsu_db";
import { getOpenAI } from "./openai/openai_api";
import { executeTest } from "./test/test";
require("dotenv").config();

const init = async () => {
  const state = await loadKatsuState()
  state.openai = getOpenAI();
  const isTest = process.env.IS_TEST === 'true';
  if (isTest) {
    executeTest(state);
  }

  // start the API server.
  apiApp(state);
}

init();
