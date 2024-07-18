import express, { Request, Response } from "express";
import { promptHandler } from "./prompts/prompt_handler";
import { authUser } from "./authentication/auth_user";
import { generateToken } from "./authentication/token";
import { validateToken } from "./authentication/token";
import { getPayloadFromToken } from "./authentication/token";
import { transfResAPI } from "./prompts/api_transf";
import openai from "openai";
import dotenv from "dotenv";
import { ResultObject } from "./prompts/result_object";

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
const apiApp = function (): void {

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
      if (authUser(user, password)) {
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

      let result: ResultObject | undefined = await new Promise((resolve, reject) => {
        const user: string = String(getPayloadFromToken(token));
        const userId: number = Number(process.env.AUTH_MEMBER_ID);
        askPrompt(prompt, user, userId, openai)
          .then((result) => resolve(result))
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
  prompt: string,
  user: string,
  userId: number,
  openai: any
): Promise<ResultObject | undefined> => {
  if (user != process.env.AUTH_USER) {
    console.log(
      "You are not a registered user. Please contact the administrator to register."
    );
  } else {
    const userName: string = process.env.AUTH_USER || "";
    let result: ResultObject = await promptHandler(
      prompt,
      userId,
      false,
      openai
    );

    return result;
  }

  return undefined;
};

export { apiApp };