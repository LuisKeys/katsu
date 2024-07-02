import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import crypto from 'crypto';

type FileObject = {
  fileName: string;
  extension: string;
  size: number;
  date: Date;
  relativePath: string;
  urlPath: string;
};

/**
 * Explores a folder and returns a list of files in the directory.
 * @param {string} directory - The path of the directory to explore.
 * @returns {Array<Object>} - An array of file objects containing information about each file.
 */
function exploreFolder(directory: string): FileObject[] {
  const files = readdirSync(directory);
  const fileList: FileObject[] = [];
  const root = process.env.FILES_FOLDER;

  files.forEach((file) => {
    const filePath = join(directory, file);
    const stats = statSync(filePath);

    if (stats.isFile()) {
      const relFilePath = filePath.replace(root as string, "");

      const fileObj = {
        fileName: file,
        extension: extname(file),
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
function searchFiles(files: FileObject[], words: Array<string>): FileObject[] {
  const searchResults: FileObject[] = [];

  files.forEach((file) => {
    const fileName = (file as any).fileName.toLowerCase();
    const promptWords = words.map(word => word.toLowerCase());

    let count = 0;
    for (let i = 0; i < promptWords.length; i++) {
      if (fileName.includes(promptWords[i])) {
        count++;
      }
    }

    const containsWords = count >= 1;

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
function copyFilesToReports(files: FileObject[]): FileObject[] {
  const copyFolder = process.env.FILES_COPY_FOLDER;
  const reportsUrl = process.env.REPORTS_URL;
  const filesFolder = process.env.FILES_FOLDER;

  const updatedFiles: FileObject[] = [];

  files.forEach((file) => {
    const { fileName, extension, relativePath, urlPath } = file as any;

    const fullPath = filesFolder + relativePath;
    const fileData = readFileSync(fullPath);
    const hash = crypto.createHash('md5').update(fileName).digest('hex');
    const newFileName = `${hash}${extension}`;
    const newPath = join(copyFolder as string, newFileName);

    writeFileSync(newPath, fileData);

    const updatedUrlPath = `${reportsUrl}/${newFileName}`;

    const updatedFile = {
      ...file,
      relativePath: newPath,
      urlPath: updatedUrlPath
    };

    updatedFiles.push(updatedFile);
  });

  return updatedFiles;
}

export {
  exploreFolder,
  FileObject,
  searchFiles,
  copyFilesToReports
};
