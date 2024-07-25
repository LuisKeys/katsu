import * as clean from '../../files/clean';
import * as excel from 'excel4node';
import * as filesName from '../../files/file_name';
import { KatsuState } from '../../state/katsu_state';
import { getColumnWidths } from '../../formatter/column_width';

/**
 * @file Creates an Excel file with the provided data.
 * @module createExcel
 */


/**
 * Creates an Excel file with KATSU report data.
 *
 * @param state - The KatsuState object containing the report data.
 * @param userIndex - The index of the user for whom the report is being generated.
 * @returns The updated KatsuState object.
 */
const createExcel = function (state: KatsuState, userIndex: number): KatsuState {
  const wb = new excel.Workbook();
  const ws = wb.addWorksheet('KATSU Report');
  let fileName = excelFileName();
  const folder = process.env.REPORTS_FOLDER;
  const fullPath = `${folder}/` + fileName;
  let columnWidths = getColumnWidths(state, userIndex);

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

  const result = state.users[userIndex].result;
  const header = result.fields;

  // Add the header row
  for (let i = 0; i < header.length; i++) {
    ws.cell(1, i + 1).string(header[i]).style(headerStyle);
    ws.column(i + 1).setWidth(columnWidths[i] + 2);
  }

  const rows = result.rows;
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < header.length; j++) {
      let value = '';
      if (rows[i][j] !== null) value = rows[i][j].toString();

      ws.cell(i + 2, j + 1).string(value).style(rowStyle);
    }
  }

  wb.write(fullPath);

  clean.cleanReports();

  const url = process.env.REPORTS_URL + fileName;
  state.users[userIndex].result.fileURL = url;
  return state;
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
