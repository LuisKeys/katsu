/**
 * Module for formatting and displaying result sets as text tables.
 * @module format_result
 */

const mdUtils = require('./markdown_utils');

const getMarkDownTable = function(result, maxColumns, dispFields, isDebug, truncate, pageNum) {

  let tableData = mdUtils.getTableData(result, dispFields, maxColumns, pageNum);
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

const getSlackFields = function(result, maxColumns, dispFields, truncate, pageNum) {

  let tableData = mdUtils.getTableData(result, dispFields, maxColumns, pageNum);
  result = mdUtils.formatTableData(tableData);
  let columnWidths = mdUtils.getColumnWidths(result.tableData, truncate);
  
  let tableFields = [];

  for (let i = 0; i < tableData.length; i++) {
    let row = tableData[i];    
    for(let j = 0; j < row.length; j++) {
      let field = row[j].toString();
      let conlumnLength = columnWidths[j];    
      let paddedField = field.padEnd(conlumnLength);

      tableField = {
        type: "mrkdwn",
        text: "*" + paddedField + "*"
      };
    
      if (i > 0) {
        tableField = {
          type: "plain_text",
          text: paddedField
        };
      }

      
      tableFields.push(tableField);
    }
  }

  return tableFields;
}

module.exports = { 
  getMarkDownTable,
  getSlackFields
};

