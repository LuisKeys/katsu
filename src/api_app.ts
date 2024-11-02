import dotenv from "dotenv";
import express, { Request, Response } from "express";
const cors = require('cors');
import { KatsuState, User } from "./state/katsu_state";
import { APIResult } from "./result/result_object";
import { authUser } from "./authentication/auth_user";
import { generateToken, validateToken } from "./authentication/token";
import { getPayloadFromToken } from "./authentication/token";
import { getUserIndex } from "./users/get_user";
import { promptHandler } from "./prompts/prompt_handler";
import { logAPIResultObject, userResultToAPIResult } from "./result/api_result_format";

dotenv.config();

const port: number = parseInt(process.env.PORT || "3020");
const api_root: string = "/api/v1/";

/**
 * Initializes the API application.
 */
const apiApp = function (state: KatsuState): void {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const corsOptions = {
    origin: '*',
    credentials: true, // Allow cookies or authentication headers
  };

  app.use(cors(corsOptions));

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  /**
   * Handles the auth route.
   * @name POST /auth
   */
  app.post(api_root + "auth", (req: Request, res: Response): void => {
    const { user, password }: { user: string; password: string } = req.body;

    try {
      if (authUser(user, password, state)) {
        const token: string = generateToken(user);
        console.log("Token generated for user: ", user);
        res.status(200).json({ token });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error: any) {
      res.status(401).json({ message: error["message"] });
    }
  });

  /**
   * Handles the prompt route.
   * @name POST /prompt
   */
  app.post(api_root + "prompt", async (req: Request, res: Response): Promise<void> => {
    const { token, prompt }: { token: string; prompt: string } = req.body;

    try {
      if (!validateToken(token)) throw new Error("Invalid token");
      if (state.isDebug) console.log("Post call prompt: ", prompt);

      const userName = getPayloadFromToken(token);
      const userIndex = getUserIndex(userName, state);
      state.users[userIndex].prompt = prompt;
      if (userIndex !== null) await promptHandler(state, userIndex);
      if (state.isDebug) console.log("Post call finished ask intent");

      const apiResult = await userResultToAPIResult(state, userIndex);
      if (state.isDebug) {
        try {
          logAPIResultObject(apiResult);
        }
        catch (error: any) {
          console.log("Error logging API result object: ", error["message"]);
        }
      }

      res.status(200).json(apiResult);
    } catch (error: any) {
      res.status(401).json({ message: error["message"] });
    }
  });

  /**
   * Starts the server and listens on the specified port.
   * @function
   * @param {number} port - The port number to listen on.
   */
  app.listen(port, () => {
    console.log(`API listening at port:${port}`);
  });
};

export { apiApp };