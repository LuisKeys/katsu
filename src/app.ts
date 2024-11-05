import { apiApp } from "./api_app";
import { loadKatsuState } from "./state/load_state";
import { getOpenAI } from "./llm/openai/openai_api";
import { executeTest } from "./test/test";

import "./formatter/string.extensions";

require("dotenv").config();

const init = async () => {
  const openai = getOpenAI();
  const state = await loadKatsuState(openai)
  state.isDebug = process.env.KATSU_DEBUG === 'true';
  // state.showWordsCount = true
  if (process.env.IS_TEST === 'true') executeTest(state);

  // no puedo volver hacer Help despues de table
  apiApp(state);
}

init();
