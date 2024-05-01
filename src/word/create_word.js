const fs = require("fs");
const filesName = require("../files/file_name");

const { Document, Packer, Paragraph, TextRun } = require("docx");

const createWord = async function(text) {
  const fileName = excelFileName();
  const folder = process.env.REPORTS_FOLDER;
  fullPath = `${folder}/` + fileName;

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: text,
                bold: false,
                font: "Calibri",
                size: 24
              }),
            ],
          }),
        ],
      },
    ],
  });
  
  await Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(fullPath, buffer);
  });

  const url = process.env.REPORTS_URL + fileName;

  return url;
};

/**
 * Generates a unique filename for the Word file based on the current date and time.
 * @returns {string} The generated filename.
 */
const excelFileName = function() {
  const fileName = filesName.randomFileName('docx');

  return fileName;
}

module.exports = { 
  createWord 
};