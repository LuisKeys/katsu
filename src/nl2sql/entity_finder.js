
/**
 * This module provides functions for finding entities based on prompts.
 * @module entity_finder
 */

var entities = []

/**
 * Finds the entity that matches the given prompt.
 * @param {string} prompt - The prompt to match against entity names and aliases.
 * @returns {Object|string} The matching entity object if found, or an empty string if not found.
 */
const getEntity = function (prompt) {

  let entities = loadEntities();
  for (let i = 0; i < entities.length; i++) {
    let entity = entities[i];

    if (prompt.includes(entity.name)) {
      return entity;
    }

    for (let j = 0; j < entity.alias.length; j++) {
      let alias = entity.alias[j];
      if (prompt.includes(alias)) {
        return entity;
      }
    }
  }

  return '';
}

/**
 * Loads the entities and returns an array of entity objects.
 * @returns {Array} An array of entity objects.
 */
const loadEntities  = () => {
  const account = {
    name: "account",
    alias: ["accounts"],
    view : "v_account",
    source: "salesforce",
    dispFields: []
  }

  const contact = {
    name: "contact",
    alias: ["contacts"],
    view : "v_contact",
    source: "salesforce",
    dispFields: ["lastname", "firstname", "phone", "email", "title"]
  }

  const lead = { 
    name: "lead",
    alias: ["leads"],
    view : "v_lead",
    source: "salesforce",
    dispFields: ["lastname", "firstname", "name", "company", "leadsource"]
  }

  const opportunity = {
    name: "opportunity",
    alias: ["opportunities"],
    view : "v_opportunity",
    source: "salesforce",
    dispFields: ["name", "stagename", "amount", "probability"]
  }

  // Requires view
  const engagement = {
    name: "engagement",
    alias: ["engagements", "projects", "project"],
    view : "v_engagement",
    source: "salesforce",
    dispFields: ["name", "customer", "start_date", "end_date", "total_project_amount"]
  }

  // Requires view
  const project_role = {
    name: "project_role",
    alias: ["project_roles", "role", "roles"],
    view : "v_project_role",
    source: "salesforce",
    dispFields: ["role", "customer_name", "valid_from", "bill_rate", "pay_rate", "valid_to"]
  }

  // Requires view
  const time_entry = {
    name: "time_entry",
    alias: ["time entries", "time entry"],
    view : "v_time_entry",
    source: "salesforce",
    dispFields: ["name", "engagementname", "contactname", "status"]
  }

  const engagement_approver = {
    name: "engagement_approver",
    alias: ["engagement approvers", "engagement approver", "approver", "approvers"],
    view : "v_engagement_approver",
    source: "salesforce",
    dispFields: ["name"]
  }

  const employees = {
    name: "employees",
    alias: ["employees", "heads", "resources", "contractors", "ftes", "employee"],
    view : "v_employees",
    source: "bamboohr",
    dispFields: ["firstname", "lastname", "jobtitle", "mobilephone", "workemail"]
  }

  const links = {
    name: "links",
    alias: ["links", "link"],
    view : "v_links",
    source: "links",
    dispFields: []
  }
  
  // Salesforce
  entities.push(account);
  entities.push(contact);
  entities.push(lead);
  entities.push(opportunity);
  entities.push(engagement);
  entities.push(project_role);
  entities.push(time_entry);
  entities.push(engagement_approver);
  
  // BambooHR
  entities.push(employees);  

  // Links
  entities.push(links);  

  return entities;
}

module.exports = { getEntity };
