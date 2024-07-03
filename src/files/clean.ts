import { readdirSync, rmdirSync, statSync, unlinkSync } from 'fs';
import { extname, join } from 'path';
import { validExtensions, getExtWithDot } from './extensions';

/**
 * @fileOverview This module provides a function to clean up old reports from a specified folder.
 * @module clean
 */


/**
 * Cleans up old reports from a specified folder.
 */
function cleanReports() {
  const directory: String = String(process.env.REPORTS_FOLDER);
  const files = readdirSync(directory as string);

  files.forEach(file => {
    const filePath = join(directory as string, file);
    const stats = statSync(filePath);
    const now = new Date().getTime();
    const endTime = new Date(stats.ctime).getTime() + 30000;

    if (now > endTime) {
      unlinkSync(filePath);
    }
  });
}

/**
 * Deletes all files with extensions different from the provided list, recursively for all folders.
 * @param {string} directory - The root directory to start the deletion process.
 */
async function cleanFiles(directory: string) {
  const files = readdirSync(directory);
  const allowedExtensions = getExtWithDot(validExtensions);

  files.forEach(file => {
    const filePath = join(directory, file);
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      cleanFiles(filePath);
    } else {
      const fileExtension = extname(file).toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        unlinkSync(filePath);
        //console.log(`File ${filePath} has an invalid extension and will be deleted.`);
      }
    }
  });
}

/**
 * Deletes all empty folders recursively from the specified directory.
 * @param {string} directory - The root directory to start the deletion process.
 */
function cleanEmptyDirs(directory: string) {
  const files = readdirSync(directory);

  files.forEach(file => {
    const filePath = join(directory, file);
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      cleanEmptyDirs(filePath);

      // Check if the directory is empty after deleting its contents
      const isEmpty = readdirSync(filePath).length === 0;
      if (isEmpty) {
        rmdirSync(filePath);
      }
    }
  });
}

export {
  cleanEmptyDirs,
  cleanFiles,
  cleanReports
};
