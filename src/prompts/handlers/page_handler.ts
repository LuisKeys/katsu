import { KatsuState } from "../../db/katsu_db/katsu_state";
import * as pageNL from "../../nl/page";
import * as pageCalc from "./page_calc";

/**
 * This module contains the handler for page prompts type.
 * @module page handler
 */


/**
 * Handles the page command prompt.
 *
 * @param state - The current state of the application.
 * @param userIndex - The index of the current user.
 * @returns The updated state of the application.
 */
const pageHandler = (state: KatsuState, userIndex: number): KatsuState => {

  const prompt = state.users[userIndex].prompt;
  const result = state.users[userIndex].result;
  const cmd = pageNL.getPageCommand(prompt);
  let page = 1;
  switch (cmd) {
    case pageNL.PAGE_LAST:
      page = pageCalc.getLastPage(result);
      break;
    case pageNL.PAGE_NEXT:
      page = pageCalc.getNextPage(result);
      break;
    case pageNL.PAGE_PREV:
      page = pageCalc.getPrevPage(result.pageNum);
      break;
    case pageNL.PAGE_NUMBER:
      page = pageNL.getPageNumber(result.prompt);
      if (page < 1) {
        page = 1;
      }
      if (page > pageCalc.getLastPage(result)) {
        page = pageCalc.getLastPage(result);
      }
      break;
    default:
      page = 1;
      break;
  }

  state.users[userIndex].result.pageNum = page;
  return state;
};

export {
  pageHandler
};