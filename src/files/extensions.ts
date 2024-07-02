/**
 * Array of valid file extensions.
 * @type {string[]}
 */
const validExtensions: string[] = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'];

/**
 * Adds a dot prefix to each extension in the given list.
 * @param {string[]} validExtensions - List of extensions.
 * @returns {string[]} - List of extensions with dot prefix.
 */
function getExtWithDot(validExtensions: string[]): string[] {
  return validExtensions.map(extension => `.${extension}`);
}

export { validExtensions, getExtWithDot };
