interface String {
  toTitleCase(): string;
  formatNumber(): string;
}

// TODO: AI generated obsolete code
// String.prototype.toTitleCase = function (): string {
//   return this.replace(/\w\S*/g, (txt) => {
//     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//   });
// };

String.prototype.toTitleCase = function (): string {
  return this
    .replace(/_/g, ' ') // Replace underscores with spaces, split by spaces
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
}

// Thousands and decimal separators
String.prototype.formatNumber = function (): string {
  const parsedNumber = parseFloat(this.toString());
  if (isNaN(parsedNumber)) return "";

  const formattedNumber = parsedNumber.toLocaleString();
  return formattedNumber;
}
