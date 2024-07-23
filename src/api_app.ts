import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { KatsuState, User } from "./state/katsu_state";
import { ResultObject } from "./result/result_object";
import { authUser } from "./authentication/auth_user";
import { generateToken, validateToken } from "./authentication/token";
import { getPayloadFromToken } from "./authentication/token";
import { getUser, getUserIndex } from "./users/get_user";
import { promptHandler } from "./prompts/prompt_handler";
import { transfResAPI } from "./result/api_transf";

/**
 * Module for initializing the API application.
 * @module apiApp
 */


dotenv.config();

const port: number = parseInt(process.env.PORT || "3020");
const api_root: string = "/api/v1/";

/**
 * Initializes the API application.
 * @function apiApp
 */
const apiApp = function (state: KatsuState): void {

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  /**
   * Handles the auth route.
   * @name POST /auth
   * @function
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  app.post(api_root + "auth", (req: Request, res: Response): void => {
    const { user, password }: { user: string; password: string } = req.body;

    try {
      if (authUser(user, password, state)) {
        const token: string = generateToken(user);
        res.status(200).json({ token });
        return;
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
   * @function
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  app.post(api_root + "prompt", async (req: Request, res: Response): Promise<void> => {
    const { token, prompt }: { token: string; prompt: string } = req.body;

    try {
      if (!validateToken(token)) {
        throw new Error("Invalid token");
      }

      let result: ResultObject | null = await new Promise((resolve, reject) => {
        const userName: string = String(getPayloadFromToken(token));
        const userIndex: number = getUserIndex(userName, state);
        state.users[userIndex].prompt = prompt;

        askPrompt(state, userIndex)
          .then((state) => resolve(state.users[userIndex].result))
          .catch((error) => reject(error));
      });

      if (result) {
        result = transfResAPI(result);
      }

      res.status(200).json({ answer: result });
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
    console.log(`api listening at port:${port}`);
  });
};

const askPrompt = async (
  state: KatsuState,
  userIndex: number
): Promise<KatsuState> => {
  const user: User = state.users[userIndex];
  if (user.email != process.env.AUTH_USER_EMAIL) {
    console.log(
      "You are not a registered user. Please contact the administrator to register."
    );
  } else {
    if (userIndex !== null) {
      state = await promptHandler(state, userIndex);
      return state;
    }
  };

  return state;
}

export { apiApp };