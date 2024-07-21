/**
 * Constants module for prompts.
 * @module prompts/constants
 */

const EXCEL = 'export excel';
const FILE = 'search file operation';
const HELP = 'help';
const PAGE = 'result page command';
const QUESTION = 'business question prompt';
const SORT = 'result sort operation';

const getConstDescription = (): { name: string, description: string }[] => {
  const constants = [
    { name: QUESTION, description: `This constant represents a business question prompt.` },
    { name: EXCEL, description: `This constant represents the export excel prompt.` },
    { name: FILE, description: `This constant represents the search file operation prompt.` },
    { name: HELP, description: `This constant represents the help prompt.` },
    { name: PAGE, description: `This constant represents the result page command prompt.` },
    { name: SORT, description: `This constant represents the result sort operation prompt.` }
  ];

  return constants;
}

function convertToCSV(objects: { name: string, description: string }[]): string {
  const header = "name,description";
  const rows = objects.map(obj => `${obj.name},${obj.description.replace(/"/g, '""')}`);
  return [header, ...rows].join("\n");
}

export {
  EXCEL,
  FILE,
  HELP,
  PAGE,
  QUESTION,
  SORT,
  convertToCSV,
  getConstDescription
};

