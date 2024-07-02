import * as mdUtils from './markdown_utils';

/**
 * Module for formatting and displaying result sets as text tables.
 * @module format_result
 */


const getMarkDownTable = function (result: any, maxColumns: number, dispFields: string[], isDebug: boolean, truncate: boolean, pageNum: number): string {

  let tableData = mdUtils.getTableData(result, false);
  result = mdUtils.formatTableData(tableData);
  let columnWidths = mdUtils.getColumnWidths(result.tableData);

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

const getSlackFields = function (result: any, maxColumns: number, dispFields: string[], truncate: boolean, pageNum: number): any[] {

  let tableData = mdUtils.getTableData(result, false);
  result = mdUtils.formatTableData(tableData);
  let columnWidths = mdUtils.getColumnWidths(result.tableData);

  let tableFields: any[] = [];

  for (let i = 0; i < tableData.length; i++) {
    let row = tableData[i];
    for (let j = 0; j < row.length; j++) {
      let field = row[j].toString();
      let conlumnLength = columnWidths[j];
      let paddedField = field.padEnd(conlumnLength);

      let tableField: any = {
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

export {
  getMarkDownTable,
  getSlackFields
};
