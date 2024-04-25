
/**
 * @file Creates an Excel file with the provided data.
 * @module createExcel
 */

const excel = require("excel4node");
const clean = require('../files/clean');
const { alignment } = require("excel4node/distribution/lib/types");

/**
 * Creates an Excel file with the provided data.
 * @param {Object} result - The data to be included in the Excel file.
 * @returns {string} The filename of the created Excel file.
 */
const createExcel = function(result) {
  var wb = new excel.Workbook();
  var ws = wb.addWorksheet('KATSU Report');
  let fileName = excelFileName();
  const folder = process.env.REPORTS_FOLDER;
  fullPath = `${folder}/` + fileName;

  var headerStyle = wb.createStyle({
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
      fgColor: 'd0d0d0'
    },    
    numberFormat: '$#,##0.00; ($#,##0.00); -',
  });

  var rowStyle = wb.createStyle({
    font: {
      color: '#101010',
      size: 12,  
      bold: false,    
    },
    numberFormat: '#,##0; (#,##0); -',
  });

  header = result.fields.map(field => field.name)

  // Add the header row
  for (let i = 0; i < header.length; i++) {
    ws.cell(1, i + 1).string(header[i]).style(headerStyle);
    ws.column(i + 1).setWidth(header[i].length + 2);
  }

  for (let i = 0; i < result.rows.length; i++) {
    let row = result.rows[i];
    for (let j = 0; j < header.length; j++) {
      const field = header[j];
      let value = '';
      if (row[field] !== null)
        value = row[field].toString();
      
      ws.cell(i + 2, j + 1).string(value).style(rowStyle);
    }    
  }

  wb.write(fullPath);

  clean.cleanReports();

  const url = process.env.REPORTS_URL + fileName;

  return url
}

/**
 * Generates a unique filename for the Excel file based on the current date and time.
 * @returns {string} The generated filename.
 */
const excelFileName = function() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  const random = Math.floor(Math.random() * 1000);

  return `katsu_report_${year}_${month}_${day}_${hours}_${minutes}_${seconds}_${milliseconds}_${random}.xlsx`;
}

module.exports = { createExcel };