import { apiApp } from "./api_app";
import { loadKatsuState } from "./db/katsu_db/katsu_db";
import { authUser } from "./authentication/auth_user";

const init = async () => {
  const state = await loadKatsuState()
  const result = authUser("luis.paradela@accelone.com", "30ydho93ywqhdoquwdh08w++WWPOj", state);
  console.log(result);
  // Start the API server.
  apiApp(state);
}

init();
