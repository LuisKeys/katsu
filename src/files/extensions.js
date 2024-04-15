
/**
 * Array of valid file extensions.
 * @type {string[]}
 */
const validExtensions = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'];

/**
 * Adds a dot prefix to each extension in the given list.
 * @param {string[]} validExtensions - List of extensions.
 * @returns {string[]} - List of extensions with dot prefix.
 */
function getExtWithDot(validExtensions) {
  return validExtensions.map(extension => `.${extension}`);
}

module.exports = { 
  validExtensions,
  getExtWithDot
};