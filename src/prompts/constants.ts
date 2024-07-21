/**
 * Constants module for prompts.
 * @module prompts/constants
 */

const ALL = 'all';
const EXCEL = 'export excel';
const FILE = 'search file operation';
const HELP = 'help';
const LINK = 'platforms link';
const LLM = 'LLM';
const PAGE = 'result page command';
const PROMPT = 'my prompts';
const QUESTION = 'question prompt';
const SORT = 'result sort operation';

export {
  ALL,
  EXCEL,
  FILE,
  HELP,
  LINK,
  LLM,
  PAGE,
  PROMPT,
  QUESTION,
  SORT,
  getConstDescription
};

const getConstDescription = (): { name: string, description: string }[] => {
  const constants = [
    { name: EXCEL, description: `This constant represents the export excel prompt.` },
    { name: FILE, description: `This constant represents the search file operation prompt.` },
    { name: HELP, description: `This constant represents the help prompt.` },
    { name: LINK, description: `This constant represents the platforms link prompt.` },
    { name: PAGE, description: `This constant represents the result page command prompt.` },
    { name: PROMPT, description: `This constant represents the my prompts prompt.` },
    { name: QUESTION, description: `This constant represents the question prompt.` },
    { name: SORT, description: `This constant represents the result sort operation prompt.` }
  ];

  return constants;
}
