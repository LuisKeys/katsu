const peopleData = require("./people_data");
const companyData = require("./company_data");

/**
 * Replaces demo values in the table data.
 * @param {Array<Array<string>>} result - The table data to modify.
 * @returns {Array<Array<string>>} - The modified table data.
 */
const replaceDemoValues = (result, entityName) => {
  const fieldNames = result.fields;

  const lastNameIndex = fieldNames.findIndex(field => field.name === "lastname");
  const firstNameIndex = fieldNames.findIndex(field => field.name === "firstname");
  const emailIndex = fieldNames.findIndex(field => field.name === "email");
  const phoneIndex = fieldNames.findIndex(field => field.name === "phone");
  const fullNameIndex = fieldNames.findIndex(field => field.name === "full_name");
  const nameIndex = fieldNames.findIndex(field => field.name === "name");

  for (let i = 0; i < result.rows.length; i++) {    
    const lastName = peopleData.getLastName();
    const firstName = peopleData.getFirstName();
    const companyName = companyData.getCompanyName();
    const email = companyData.getEmail(firstName, lastName, companyName);
    const phone = peopleData.getPhone();

    if (lastNameIndex !== -1) {
      result.rows[i][fieldNames[lastNameIndex].name ]= lastName;
    }

    if (firstNameIndex !== -1) {
      result.rows[i][fieldNames[firstNameIndex].name] = firstName;
    }

    if (emailIndex !== -1) {
      result.rows[i][fieldNames[emailIndex].name] = email;
    }

    if (phoneIndex !== -1) {
      result.rows[i][fieldNames[phoneIndex].name] = phone;
    }

    if (fullNameIndex !== -1) {
      result.rows[i][fieldNames[fullNameIndex].name] = firstName + ' ' + lastName;
    }    

    if (nameIndex !== -1) {
      let name = firstName + ' ' + lastName;
      
      result.rows[i][fieldNames[nameIndex].name] = name;
    }    
  }

  return result;
};

module.exports = {
  replaceDemoValues,
};
