/**
 * Module for formatting and displaying result sets as text tables.
 * @module format_result
 */

const mdUtils = require('./markdown_utils');

const getMarkDownTable = function(result, maxColumns, dispFields, isDebug, truncate) {

  let tableData = mdUtils.getTableData(result, dispFields, maxColumns);
  result = mdUtils.formatTableData(tableData);
  let columnWidths = mdUtils.getColumnWidths(result.tableData, truncate);
  
  let table = '';

  for (let i = 0; i < tableData.length; i++) {
    let row = tableData[i];    
    let markdownRow = mdUtils.getMarkdownTableRow(row, columnWidths, result.numColumns, truncate);
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

