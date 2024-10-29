import { UserResult } from "../../result/result_object";

/**
 * Calculates the last page number based on the total number of rows and the page size.
 *
 * @param {Object} result - The result object containing the rows.
 * @returns {number} The last page number.
 */
const getLastPage = (result: UserResult): number => {
  const pageSize = Number(process.env.PAGE_SIZE);
  const lastPage = Math.ceil(result.rows.length / pageSize);
  return lastPage;
};

/**
 * Gets the next page number based on the current page number and the result.
 *
 * @param {number} pageNum - The current page number.
 * @param {any} result - The result object.
 * @returns {number} - The next page number.
 */
const getNextPage = (result: UserResult): number => {
  let page = result.pageNum;
  page++;
  const lastPage = getLastPage(result);
  if (page > lastPage) {
    page = lastPage;
  }
  return page;
};

/**
 * Returns the previous page number based on the given page number.
 *
 * @param {number} pageNum - The current page number.
 * @returns {number} - The previous page number.
 */
const getPrevPage = (pageNum: number): number => {
  let page = pageNum;
  page--;
  if (page < 1) {
    page = 1;
  }

  return page;
};

export {
  getLastPage,
  getNextPage,
  getPrevPage
};
