import { apiApp } from "./api_app";
import { executeTest } from "./test/test";
import { loadKatsuState } from "./db/katsu_db/katsu_db";

loadKatsuState()
  .then(katsuState => {
    console.log(katsuState);
  })
  .catch(error => {
    console.error('Error loading KatsuState:', error);
  });


const test = async () => {
  await executeTest();
}

const isTest = process.env.IS_TEST;
if (isTest === "true") {
  test();
}

// Start the API server.
apiApp();
