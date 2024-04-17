const { url } = require('inspector');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');



/**
 * Explores a folder and returns a list of files in the directory.
 * @param {string} directory - The path of the directory to explore.
 * @returns {Array<Object>} - An array of file objects containing information about each file.
 */
function exploreFolder(directory) {
  const files = fs.readdirSync(directory);
  const fileList = [];
  const baseFilesURL = process.env.FILES_BASE_URL;
  const root = process.env.FILES_FOLDER;

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {

      relFilePath = filePath.replace(root, "");

      const fileObj = {
        fileName: file,
        extension: path.extname(file),
        size: stats.size,
        date: stats.mtime,
        relativePath: relFilePath,
        urlPath: ""
      };

      fileList.push(fileObj);
    } else if (stats.isDirectory()) {
      const subFiles = exploreFolder(filePath);
      fileList.push(...subFiles);
    }
  });

  return fileList;
}

/**
 * Searches for files in the given list that contain at least two words from the prompt.
 * @param {Array<Object>} files - The list of file objects to search through.
 * @param {Array<string>} words - The list of words to search for.
 * @returns {Array<string>} - An array of file names that match the search criteria.
 */
function searchFiles(files, words) {
  const searchResults = [];

  files.forEach((file) => {
    const fileName = file.fileName.toLowerCase();
    const promptWords = words.map(word => word.toLowerCase());

    let count = 0
    for(let i = 0; i < promptWords.length; i++) {
      if (fileName.includes(promptWords[i])) {
        count++;
      }
    }

    const containsWords = count >= 2;

    if (containsWords) {
      searchResults.push(file);
    }
  });

  return searchResults;
}

/**
 * Copies files to the specified folder and updates the URL path.
 * @param {Array<Object>} files - The list of file objects to copy.
 * @returns {Array<Object>} - An array of file objects with updated URL paths.
 */
function copyFilesToReports(files) {
  const copyFolder = process.env.COPY_FOLDER;
  const reportsUrl = process.env.REPORTS_URL;
  const filesFolder = process.env.FILES_FOLDER;  

  const updatedFiles = [];

  files.forEach((file) => {
    const { fileName, extension, relativePath, urlPath } = file;

    const fullPath = filesFolder + relativePath;
    const fileData = fs.readFileSync(fullPath);
    const hash = crypto.createHash('md5').update(fileName).digest('hex');
    const newFileName = `${hash}${extension}`;
    const newPath = path.join(copyFolder, newFileName);

    fs.writeFileSync(newPath, fileData);

    const updatedUrlPath = `${reportsUrl}/${newFileName}`;

    const updatedFile = {
      ...file,
      fileName: newFileName,
      relativePath: newPath,
      urlPath: updatedUrlPath
    };

    updatedFiles.push(updatedFile);
  });

  return updatedFiles;
}


module.exports = {
  exploreFolder,
  searchFiles,
  copyFilesToReports
};
