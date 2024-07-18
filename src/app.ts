import { apiApp } from "./api_app";
import { executeTest } from "./test/test";

const test = async () => {
  await executeTest();
}

const isTest = process.env.IS_TEST;
if (isTest === "true") {
  test();
}

// Start the API server.
apiApp();
