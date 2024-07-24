import { KatsuState } from "../../state/katsu_state";
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
const pageHandler = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {

  const result = state.users[userIndex].result;
  const cmd = await pageNL.getPageCommand(state, userIndex);
  let page = 1;
  switch (cmd) {
    case pageNL.FIRST_PAGE:
      page = 1;
      break;
    case pageNL.LAST_PAGE:
      page = pageCalc.getLastPage(result);
      break;
    case pageNL.NEXT_PAGE:
      page = pageCalc.getNextPage(result);
      break;
    case pageNL.PREV_PAGE:
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