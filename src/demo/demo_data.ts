import { getLastName, getFirstName, getPhone } from "./people_data";
import { getCompanyName, getEmail, getAmount } from "./company_data";
import { Result } from "../prompts/result_object";

/**
 * Replaces demo values in the table data.
 * @param {Array<Array<string>>} result - The table data to modify.
 * @param {string} entityName - The name of the entity.
 * @returns {Array<Array<string>>} - The modified table data.
 */
const replaceDemoValues = (result: Result, entityName: string): Result => {
  if (result) {
    const fieldNames = result[0];

    const lastNameIndex = fieldNames.findIndex(
      (field) => field === "lastname"
    );
    const firstNameIndex = fieldNames.findIndex(
      (field) => field === "firstname"
    );

    const fullNameIndex = fieldNames.findIndex(
      (field) => field === "full_name"
    );

    const nameIndex = fieldNames.findIndex((field) => field === "name");

    const customerNameIndex = fieldNames.findIndex(
      (field) => field === "customer_name"
    );

    const companyIndex = fieldNames.findIndex(
      (field) => field === "company"
    );

    let emailFields: string[] = [];
    for (let i = 0; i < fieldNames.length; i++) {
      if (fieldNames[i].includes("email")) {
        emailFields.push(fieldNames[i]);
      }
    }

    let phoneFields: string[] = [];
    for (let i = 0; i < fieldNames.length; i++) {
      if (fieldNames[i].includes("phone")) {
        phoneFields.push(fieldNames[i]);
      }
    }

    let amountFields: string[] = [];
    for (let i = 0; i < fieldNames.length; i++) {
      if (fieldNames[i].includes("amount")) {
        amountFields.push(fieldNames[i]);
      }
    }

    for (let i = 0; i < result.rows.length; i++) {
      const lastName = getLastName();
      const firstName = getFirstName();
      const companyName = getCompanyName();
      const email = getEmail(firstName, lastName, companyName);
      const phone = getPhone();
      const amount = getAmount();

      if (lastNameIndex !== -1) {
        result[i][lastNameIndex] = lastName;
      }

      if (firstNameIndex !== -1) {
        result[i][firstNameIndex] = firstName;
      }

      if (emailFields.length > 0) {
        for (let j = 0; j < emailFields.length; j++) {
          result[i][fieldNames.indexOf(emailFields[j])] = email;
        }
      }

      if (phoneFields.length > 0) {
        for (let j = 0; j < phoneFields.length; j++) {
          result[i][fieldNames.indexOf(phoneFields[j])] = phone;
        }
      }

      if (fullNameIndex !== -1) {
        result[i][fullNameIndex] = `${firstName} ${lastName}`;
      }

      if (companyIndex !== -1) {
        result[i][companyIndex] = companyName;
      }

      if (nameIndex !== -1) {
        let name = `${firstName} ${lastName}`;

        if (entityName === "company" || entityName === "engagement") {
          name = companyName;
        }

        result[i][nameIndex] = name;
      }

      if (customerNameIndex !== -1 && entityName === "project_role") {
        result[i][customerNameIndex] = companyName;
      }

      if (amountFields.length > 0) {
        for (let j = 0; j < amountFields.length; j++) {
          result[i][fieldNames.indexOf(amountFields[j])] = amount;
        }
      }
    }

    return result;
  } else {
    return result;
  }
};

export {
  replaceDemoValues,
};
