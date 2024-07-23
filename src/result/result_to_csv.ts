import { QueryResult } from 'pg';

function convertResultToCSV(queryResult: QueryResult): string {
  // Extract the headers from the fields
  const headers = queryResult.fields.map(field => field.name);

  // Map rows to CSV format
  const rows = queryResult.rows.map(row => {
    return headers.map(header => row[header]).join(',');
  });

  // Combine headers and rows
  return [headers.join(','), ...rows].join('\n');
}

export { convertResultToCSV };