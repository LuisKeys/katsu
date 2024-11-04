import { getSortfield, getSortDirection } from "../../nl/sort_field_finder";
import { sortResult } from "./sort_result";
import { KatsuState, User } from "../../state/katsu_state";

const sortHandler = async (userState: User, state: KatsuState) => {
  const result = userState.result;
  const sortField = await getSortfield(userState, state);
  const sortDir = await getSortDirection(userState, state);
  sortResult(userState.result, sortField, sortDir);

  result.pageNum = 1;
  userState.result = result;
};

export {
  sortHandler
};
