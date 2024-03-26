const fs = require('fs');
const path = require('path');

/**
 * Cleans up old reports from a specified folder.
 */
function cleanReports() {
  const folder = process.env.REPORTS
  const directory = path.join(__dirname, '../../' + folder);
  const files = fs.readdirSync(directory);

  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    const now = new Date().getTime();
    const endTime = new Date(stats.ctime).getTime() + 3600000;

    if (now > endTime) {
      fs.unlinkSync(filePath);
    }
  });
}

module.exports = { cleanReports };