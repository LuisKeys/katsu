const constants = require("./constants");

/**
 * Calculates the last page number based on the total number of rows and the page size.
 *
 * @param {Object} result - The result object containing the rows.
 * @returns {number} The last page number.
 */
const getLastPage = (result) => {
  const lastPage = Math.ceil(result.rows.length / constants.PAGE_SIZE);  
  return lastPage;
}

/**
 * Gets the next page number based on the current page number and the result.
 *
 * @param {number} pageNum - The current page number.
 * @param {any} result - The result object.
 * @returns {number} - The next page number.
 */
const getNextPage = (pageNum, result) => {
  page = pageNum;
  page++;
  const lastPage = getLastPage(result);
  if (page > lastPage) {
    page = lastPage;
  }
  return page;
}

/**
 * Returns the previous page number based on the given page number.
 *
 * @param {number} pageNum - The current page number.
 * @returns {number} - The previous page number.
 */
const getPrevPage = (pageNum) => {
  let page = pageNum;
  page--;
  if (page < 1) {
    page = 1;
  }

  return page;
}

module.exports = {
  getLastPage,
  getNextPage,
  getPrevPage
};