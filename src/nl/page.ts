const PAGE_NEXT = 'next';
const PAGE_PREV = 'prev';
const PAGE_FIRST = 'first';
const PAGE_LAST = 'last';
const PAGE_NUMBER = 'number';

/**
 * Retrieves the page command based on the given prompt.
 *
 * @param {string} prompt - The prompt to extract the page command from.
 * @returns {string} The page command.
 */
const getPageCommand = (prompt: string): string => {
  let cmd = prompt.toLowerCase().replace('page', '').trim();
  if (/^\d+$/.test(cmd)) {
    cmd = PAGE_NUMBER;
    return cmd;
  }

  switch (cmd) {
    case 'last':
      cmd = PAGE_LAST;
      break;
    case 'next':
      cmd = PAGE_NEXT;
      break;
    case 'previous':
      cmd = PAGE_PREV;
      break;
    default:
      cmd = PAGE_FIRST;
      break;
  }
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
  PAGE_FIRST,
  PAGE_LAST,
  PAGE_NEXT,
  PAGE_NUMBER,
  PAGE_PREV,
  getPageCommand,
  getPageNumber
};