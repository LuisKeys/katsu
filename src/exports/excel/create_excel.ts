import * as clean from '../../files/clean';
import * as excel from 'excel4node';
import * as mdUtils from '../../formatter/markdown_utils';
import * as filesName from '../../files/file_name';
import { ResultObject } from '../../result/result_object';

/**
 * @file Creates an Excel file with the provided data.
 * @module createExcel
 */


/**
 * Creates an Excel file with the provided data.
 * @param {Object} result - The data to be included in the Excel file.
 * @returns {string} The filename of the created Excel file.
 */
const createExcel = function (result: ResultObject): string {
  const wb = new excel.Workbook();
  const ws = wb.addWorksheet('KATSU Report');
  let fileName = excelFileName();
  const folder = process.env.REPORTS_FOLDER;
  const fullPath = `${folder}/` + fileName;

  let tableData = mdUtils.getTableData(result, true);
  let columnWidths = mdUtils.getColumnWidths(tableData);

  const headerStyle = wb.createStyle({
    font: {
      color: '#000000',
      size: 12,
      bold: true,
    },
    alignment: {
      horizontal: 'center',
      vertical: 'center',
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      bgColor: 'd0d0d0',
      fgColor: 'd0d0d0',
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -',
  });

  const rowStyle = wb.createStyle({
    font: {
      color: '#101010',
      size: 12,
      bold: false,
    },
    numberFormat: '#,##0; (#,##0); -',
  });

  const header = result.fields.map((field: any) => field.name);

  // Add the header row
  for (let i = 0; i < header.length; i++) {
    ws.cell(1, i + 1).string(header[i]).style(headerStyle);
    ws.column(i + 1).setWidth(columnWidths[i] + 2);
  }

  for (let i = 0; i < result.rows.length; i++) {
    let row = result.rows[i];
    for (let j = 0; j < header.length; j++) {
      const field = header[j];
      let value = '';
      if (row[field] !== null) value = row[field].toString();

      ws.cell(i + 2, j + 1).string(value).style(rowStyle);
    }
  }

  wb.write(fullPath);

  clean.cleanReports();

  const url = process.env.REPORTS_URL + fileName;

  return url;
};

/**
 * Generates a unique filename for the Excel file based on the current date and time.
 * @returns {string} The generated filename.
 */
const excelFileName = function (): string {
  const fileName = filesName.randomFileName('xlsx');

  return fileName;
};

export { createExcel };
