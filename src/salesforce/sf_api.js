//Salesforce API connector
const axios = require('axios');
const { parse } = require('dotenv');
const { parseSFData } = require('./sf_parser');

// Required environment variables
const base_url = process.env.SF_BASE_URL;
const query_url = process.env.SF_QUERY_URL;
const clientId = process.env.SF_CLIENT_ID;
const clientSecret = process.env.SF_CLIENT_SECRET;
const username = process.env.SF_USERNAME;
const password = process.env.SF_PASSWORD;

// Authenticate with Salesforce
/**
 * Authenticates the user with Salesforce using the provided credentials.
 * @returns {Promise<{accessToken: string, instanceUrl: string}>} The access token and instance URL.
 * @throws {Error} If authentication fails.
 */
const authenticate = async function () {
  try {
    const response = await axios.post( base_url + '/services/oauth2/token', {
      client_id: clientId,
      grant_type:'password',
      client_secret: clientSecret,
      username: username,
      password: password
    }, {
      headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }});

    // Handle the authentication response here
    const accessToken = response.data.access_token;
    const instanceUrl = response.data.instance_url;

    // Return the access token and instance URL
    return { accessToken, instanceUrl };
  } catch (error) {
    // Handle any errors that occur during authentication
    console.error('Authentication failed:', error.message);
    throw error;
  }
}

/**
 * Retrieves information from the Salesforce API using the provided access token.
 * @param {string} accessToken The access token obtained from the authentication method.
 * @param {string} path The API path to retrieve information from.
 * @returns {Promise<any>} The response data from the API.
 * @throws {Error} If the API request fails.
 */
const get = async function (accessToken, path) {
  try {
    const response = await axios.get(`${base_url}${path}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle any errors that occur during the API request    
    throw error;
  }
}

const getData = function (query) {
  const path = query_url + query;

  // Authenticate with Salesforce and log the response  
  authenticate().then((response) => {
    sf_accessToken = response.accessToken;  

    get(sf_accessToken, path).then((response) => {      
      output = parseSFData(response);
      output.forEach((line) => {
        console.log(line);
      });

    }).catch((error) => {  
      throw error;
    });  

  }).catch((error) => {
    console.error(error);
    throw error;
  });
}

module.exports = {
  authenticate,
  get,
  getData
};

