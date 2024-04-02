/**
 * Module for formatting and displaying result sets as text tables.
 * @module format_result
 */

const mdUtils = require('./markdown_utils');

const getMarkDownTable = function(result, maxColumns, isDebug) {

  let tableData = mdUtils.getTableData(result, maxColumns);
  let columnWidths = mdUtils.getColumnWidths(tableData);
  
  let table = '';

  for (let i = 0; i < tableData.length; i++) {
    let row = tableData[i];
    const isHeader = i === 0;
    let markdownRow = mdUtils.getMarkdownTableRow(row, columnWidths, isHeader);
    table += markdownRow + '\n';

    if (i === 0) {
      let separator = mdUtils.getMarkdownTableSeparator(columnWidths);
      table += separator + '\n';
    }
  }

  if (isDebug) {
    console.log(table);
  }

  return table;
}

module.exports = { getMarkDownTable };

