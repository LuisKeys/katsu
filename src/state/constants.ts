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
    { name: `QUESTION`, description: `Represents any business question prompt for any repartment such as sales, HR, engineering, finance or operations.` },
    { name: `EXCEL`, description: `Represents the export excel operation.` },
    { name: `FILE`, description: `Represents the search file operation.` },
    { name: `HELP`, description: `This constant represents the help prompt.` },
    { name: `PAGE`, description: `Represents a page operation such as next page, previous page, first or last page.` },
    { name: `SORT`, description: `Represents an order by or sort operation.` }
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

