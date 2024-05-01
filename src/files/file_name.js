/**
 * Generates a unique filename for the Excel file based on the current date and time.
 * @returns {string} The generated filename.
 */
const randomFileName = function(extension) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  const random = Math.floor(Math.random() * 1000);

  return `katsu_report_${year}_${month}_${day}_${hours}_${minutes}_${seconds}_${milliseconds}_${random}.` + extension;
}

module.exports = { randomFileName };