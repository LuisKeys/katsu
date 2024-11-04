import { createPageCMDPrompt } from '../llm/prompt_generators/page_cmd_gen';
import { KatsuState, User } from '../state/katsu_state';
import { askAI } from '../llm/openai/openai_api';

const FIRST_PAGE = 'FIRST_PAGE';
const NEXT_PAGE = 'NEXT_PAGE';
const PREV_PAGE = 'PREV_PAGE';
const LAST_PAGE = 'LAST_PAGE';
const PAGE_NUMBER = 'PAGE_NUMBER';

const getPageCommand = async (userState: User, state: KatsuState): Promise<string> => {
  userState.context = createPageCMDPrompt(userState.prompt);
  const cmd = await askAI(state, userState.context);
  return cmd;
}

const getPageNumber = (prompt: string): number => {
  let cmd = prompt.toLowerCase().replace('page', '').trim();
  if (/^\d+$/.test(cmd)) {
    return parseInt(cmd);
  }

  return 1;
}

export {
  FIRST_PAGE,
  LAST_PAGE,
  NEXT_PAGE,
  PAGE_NUMBER,
  PREV_PAGE,
  getPageCommand,
  getPageNumber
};