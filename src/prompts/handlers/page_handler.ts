import { KatsuState, User } from "../../state/katsu_state";
import * as pageNL from "../../nl/page";
import * as pageCalc from "./page_calc";

const pageHandler = async (userState: User, state: KatsuState) => {
  const result = userState.result;
  const cmd = await pageNL.getPageCommand(userState, state);
  let page = 1;
  switch (cmd) {
    case pageNL.FIRST_PAGE: page = 1; break;
    case pageNL.LAST_PAGE: page = pageCalc.getLastPage(result); break;
    case pageNL.NEXT_PAGE: page = pageCalc.getNextPage(result); break;
    case pageNL.PREV_PAGE: page = pageCalc.getPrevPage(result.pageNum); break;
    case pageNL.PAGE_NUMBER:
      page = pageNL.getPageNumber(result.prompt);
      if (page < 1) page = 1;

      const lastPage = pageCalc.getLastPage(result);
      if (page > lastPage) page = lastPage;
  }

  result.pageNum = page;
};

export {
  pageHandler
};