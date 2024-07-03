import { writeFileSync } from "fs";
import { randomFileName } from "../files/file_name";
import { Document, Packer, Paragraph, TextRun } from "docx";

const createWord = async function (text: string): Promise<string> {
  const fileName = excelFileName();
  const folder = process.env.REPORTS_FOLDER;
  const fullPath = `${folder}/` + fileName;

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
    writeFileSync(fullPath, buffer);
  });

  const url = process.env.REPORTS_URL + fileName;

  return url;
};

/**
 * Generates a unique filename for the Word file based on the current date and time.
 * @returns {string} The generated filename.
 */
const excelFileName = function (): string {
  const fileName = randomFileName('docx');

  return fileName;
}

export { createWord };
