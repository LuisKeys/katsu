const peopleData = require("./people_data");
const companyData = require("./company_data");

/**
 * Replaces demo values in the table data.
 * @param {Array<Array<string>>} result - The table data to modify.
 * @returns {Array<Array<string>>} - The modified table data.
 */
const replaceDemoValues = (result, entityName) => {
  const fieldNames = result.fields;

  const lastNameIndex = fieldNames.findIndex(
    (field) => field.name === "lastname"
  );
  const firstNameIndex = fieldNames.findIndex(
    (field) => field.name === "firstname"
  );
  const emailIndex = fieldNames.findIndex((field) => field.name === "email");
  const phoneIndex = fieldNames.findIndex((field) => field.name.indexOf("phone") > -1);
  const fullNameIndex = fieldNames.findIndex(
    (field) => field.name === "full_name"
  );
  const nameIndex = fieldNames.findIndex((field) => field.name === "name");
  const customerNameIndex = fieldNames.findIndex(
    (field) => field.name === "customer_name"
  );

  let amountFields = [];
  for(let i = 0; i < fieldNames.length; i++) {
    if(fieldNames[i].name.indexOf("amount") > -1) {
      amountFields.push(fieldNames[i].name);
    }
  }

  for (let i = 0; i < result.rows.length; i++) {
    const lastName = peopleData.getLastName();
    const firstName = peopleData.getFirstName();
    const companyName = companyData.getCompanyName();
    const email = companyData.getEmail(firstName, lastName, companyName);
    const phone = peopleData.getPhone();
    const amount = companyData.getAmount();

    if (lastNameIndex !== -1) {
      result.rows[i][fieldNames[lastNameIndex].name] = lastName;
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
      result.rows[i][fieldNames[fullNameIndex].name] =
        firstName + " " + lastName;
    }

    if (nameIndex !== -1) {
      let name = firstName + " " + lastName;

      if (entityName === "company") {
        name = companyName;
      }

      if (entityName === "engagement") {
        name = companyName;
      }

      result.rows[i][fieldNames[nameIndex].name] = name;
    }

    if (customerNameIndex !== -1) {
      if (entityName === "project_role") {
        result.rows[i][fieldNames[customerNameIndex].name] = companyName;
      }
    }    

    if (amountFields.length > 0) {
      for(let j = 0; j < amountFields.length; j++) {
        result.rows[i][amountFields[j]] = amount;
      }
    }    
    
  }
  
  return result;
};

module.exports = {
  replaceDemoValues,
};
