import { createPageCMDPrompt } from '../llm/prompt_generators/page_cmd_gen';
import { KatsuState } from '../state/katsu_state';
import { ask } from '../llm/openai/openai_api';

const FIRST_PAGE = 'FIRST_PAGE';
const NEXT_PAGE = 'NEXT_PAGE';
const PREV_PAGE = 'PREV_PAGE';
const LAST_PAGE = 'LAST_PAGE';
const PAGE_NUMBER = 'PAGE_NUMBER';

const getPageCommand = async (state: KatsuState, userIndex: number): Promise<string> => {
  const llmPrompt = createPageCMDPrompt(state, userIndex);
  state.users[userIndex].context = llmPrompt;
  const cmd = await ask(state, userIndex);
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