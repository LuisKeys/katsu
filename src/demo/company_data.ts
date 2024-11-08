/**
 * Retrieves a random fictional company name from a predefined list of company names.
 * @returns {string} A random company name.
 */
function getCompanyName(): string {
  const companyNames: string[] = ['Acme Corporation', 'Globex Industries', 'Wayne Enterprises', 'Stark Industries', 'Umbrella Corporation', 'LexCorp', 'InGen', 'Weyland-Yutani', 'Cyberdyne Systems', 'Aperture Science', 'Oscorp', 'Tyrell Corporation', 'Virtucon', 'Spacely Sprockets', 'Soylent Corporation', 'Monarch Sciences', 'Buy N Large', 'Blue Sun Corporation', 'Hooli', 'Prestige Worldwide', 'Strickland Propane', 'Dunder Mifflin', 'Vandelay Industries', 'Bluth Company', 'Sterling Cooper', 'Gekko & Co.', 'SPECTRE', 'KaibaCorp', 'Walt Disney Corporation', 'Weyland Industries', 'Gringotts Bank', 'Stark Enterprises', 'Cyberdyne', 'Spacely Space Sprockets', 'Soylent Industries', 'Monarch Corporation', 'Buy More', 'Blue Sun', 'Hooli XYZ', 'Strickland Propane & Propane Accessories', 'Dunder Mifflin Paper Company', 'Vandelay Industries Import/Export', 'Bluth Development Company', 'Sterling Cooper Draper Pryce', 'Kaiba Corporation', 'Wayne Enterprises', 'Globex Corporation', 'Umbrella Corp', 'LexCorp', 'InGen Corporation', 'Weyland-Yutani Corporation', 'Cyberdyne Systems Corporation', 'Aperture Science, Inc.', 'Oscorp Industries', 'Tyrell Corporation', 'Virtucon Industries', 'Spacely Sprockets, Inc.', 'Soylent Corporation', 'Monarch Sciences, LLC', 'Buy N Large Corporation', 'Blue Sun Corporation', 'Hooli, Inc.', 'Prestige Worldwide, LLC', 'Strickland Propane, Inc.', 'Dunder Mifflin, Inc.', 'Vandelay Industries, LLC', 'Bluth Company, LLC', 'Sterling Cooper Advertising Agency', 'Gekko & Co., Inc.', 'SPECTRE', 'KaibaCorp', 'Walt Disney Company', 'Weyland Industries, LLC', 'Gringotts Wizarding Bank', 'Stark Enterprises, Inc.', 'Cyberdyne Systems', 'Spacely Space Sprockets, Inc.', 'Soylent Industries, LLC', 'Monarch Corporation', 'Buy More Electronics', 'Blue Sun Corporation', 'Hooli XYZ, Inc.', 'Strickland Propane & Propane Accessories, Inc.', 'Dunder Mifflin Paper Company, Inc.', 'Vandelay Industries Import/Export, Inc.', 'Bluth Development Company, LLC', 'Sterling Cooper Draper Pryce Advertising Agency', 'Kaiba Corporation'];
  const randomIndex: number = Math.floor(Math.random() * companyNames.length);
  return companyNames[randomIndex];
}

/**
 * Creates an email address based on the given first name, last name, and company name.
 * @param {string} firstName - The first name.
 * @param {string} lastName - The last name.
 * @param {string} companyName - The company name.
 * @returns {string} The email address.
 */
function getEmail(firstName: string, lastName: string, companyName: string): string {
  const truncatedCompanyName: string = companyName.substring(0, 10);
  const email: string = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${truncatedCompanyName.toLowerCase().replace(" ", "")}.com`;
  return email;
}

/**
 * Retrieves a random amount between 50000 and 400000.
 * @returns {number} A random amount.
 */
function getAmount(): number {
  const min: number = 50000;
  const max: number = 400000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { 
  getAmount,
  getCompanyName,
  getEmail
};