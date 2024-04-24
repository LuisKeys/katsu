/**
 * Calculates the last page number based on the total number of rows and the maximum number of lines per page.
 * @param {Object} result - The result object containing the rows.
 * @returns {Object} - The updated result object with the last page number.
 */
const getLastPage = (result) => {
  const lastPage = Math.ceil(result.rows.length / constants.PAGE_SIZE);
  result.page = lastPage;
  return result;
}

/**
 * Increments the page number of the given result object.
 *
 * @param {Object} result - The result object containing the current page number.
 * @returns {Object} - The updated result object with the incremented page number.
 */
const getNextPage = (result) => {
  result.page++;
  return result;
}

/**
 * Decreases the page number of the given result object by 1.
 * @param {Object} result - The result object containing the page number.
 * @returns {Object} - The updated result object with the decreased page number.
 */
const getPrevPage = (result) => {
  result.page--;
  return result;
}

/**
 * Sets the page number to 1 for the given result object.
 * @param {Object} result - The result object.
 * @returns {Object} - The updated result object with the page number set to 1.
 */
const getFirstPage = (result) => {
  result.page = 1;
  return result;
}

module.exports = {
  getFirstPage,
  getLastPage,
  getNextPage,
  getPrevPage
};