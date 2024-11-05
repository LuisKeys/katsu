enum promptTypes {
  QUESTION = 'QUESTION',
  EXCEL = 'EXCEL',
  FILE = 'FILE',
  HELP = 'HELP',
  PAGE = 'PAGE',
  SORT = 'SORT'
}

const getConstDescription = (): { name: string, description: string }[] => {
  const constants = [
    { name: `QUESTION`, description: `Represents any business question prompt for any repartment such as sales, HR, engineering, finance or operations.` },
    { name: `EXCEL`, description: `Represents the export excel operation.` },
    // { name: `FILE`, description: `Represents the search file operation. File word is a must.` },
    { name: `HELP`, description: `Represents a help prompt, the word help must be present.` },
    { name: `PAGE`, description: `Represents a page operation such as next page, previous page, first or last page.` },
    { name: `SORT`, description: `Represents an order by or sort operation. The word sort or order by must be present and the prompot should have no more than 4 words.` }
  ];

  return constants;
}

function convertToCSV(objects: { name: string, description: string }[]): string {
  const header = "name,description";
  const rows = objects.map(obj => `${obj.name},${obj.description.replace(/"/g, '""')}`);
  return [header, ...rows].join("\n");
}

export {
  promptTypes,
  convertToCSV,
  getConstDescription
};

