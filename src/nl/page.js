const PAGE_NEXT = 'next';
const PAGE_PREV = 'prev';
const PAGE_FIRST = 'first';
const PAGE_LAST = 'last';

/**
 * Retrieves the page command based on the given prompt.
 *
 * @param {string} prompt - The prompt to extract the page command from.
 * @returns {string} The page command.
 */
const getPageCommand = (prompt) => {
  let cmd = prompt.toloLowerCase().replace('page', '').trim();
  switch(cmd) {
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

module.exports = { 
  PAGE_FIRST,
  PAGE_LAST,
  PAGE_NEXT,
  PAGE_PREV,
  getPageCommand
};