
/**
 * This module provides functions for finding entities based on prompts.
 * @module entity_finder
 */

const openAI = require("openai");
const openAIAPI = require("../openai/openai_api");

var entities = []

const openai = new openAI();

/**
 * Finds the entity that matches the given prompt.
 * @param {string} prompt - The prompt to match against entity names and aliases.
 * @returns {Object|string} The matching entity object if found, or an empty string if not found.
 */
const getEntities = async function (prompt) {

  let context = "";

  context += `Which of the following entities apply for the prompt='${prompt}':`;

  let entities = loadEntities();
  for (let i = 0; i < entities.length; i++) {
    let entity = entities[i];

    context += `${entity.name}, `;
  }

  context += ";express the result as a comma separated list of elements.More than one entity can be selected. Do not use any other";  

  const entitiesNames = await openAIAPI.ask(
    openai,
    context
  );

    let clentities = entitiesNames.split(",");
  clentities = clentities.map(entity => entity.replace(/-/g, "").replace(/\s/g, ""));

  console.log("Entities: ", clentities);

  let foundEntities = [];
  for (let i = 0; i < entities.length; i++) {
    let entity = entities[i];
    for (let j = 0; j < clentities.length; j++) {
      if (entity.name === clentities[j]) {
        foundEntities.push(entity);        
      }
    }    
  }

  return foundEntities;
}

/**
 * Loads the entities and returns an array of entity objects.
 * @returns {Array} An array of entity objects.
 */
const loadEntities  = () => {
  const account = {
    name: "account",
    view : "v_account",
    dispFields: []
  }

  const contact = {
    name: "contact",
    view : "v_contact",
    dispFields: ["lastname", "firstname", "phone", "email"]
  }

  const lead = { 
    name: "lead",
    view : "v_lead",
    dispFields: ["lastname", "firstname", "company", "leadsource"]
  }

  const opportunity = {
    name: "opportunity",
    view : "v_opportunity",
    dispFields: ["name", "stagename", "amount", "probability"]
  }

  // Requires view
  const engagement = {
    name: "engagement",
    view : "v_engagement",
    dispFields: ["name", "project_type", "total_project_amount"]
  }

  // Requires view
  const project_role = {
    name: "project_role",
    view : "v_project_role",
    dispFields: ["role", "customer_name", "bill_rate", "pay_rate"]
  }

  // Requires view
  const time_entry = {
    name: "time_entry",
    view : "v_time_entry",
    dispFields: ["name", "engagementname", "contactname", "status"]
  }

  const engagement_approver = {
    name: "engagement_approver",
    view : "v_engagement_approver",
    dispFields: ["name"]
  }

  const employees = {
    name: "employees",
    view : "v_employees",
    dispFields: ["firstname", "lastname", "mobilephone", "workemail"]
  }

  const links = {
    name: "links",
    view : "v_links",
    dispFields: []
  }
  
  const prompts_history = {
    name: "prompts_history",
    view : "v_prompts_history",
    dispFields: ["prompt"]
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

  // prompts_hitory
  entities.push(prompts_history);  

  return entities;
}

module.exports = { getEntities };
