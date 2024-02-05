const RECORD_DIVIDER = ' -------------------------';
const SF_BASE_LIGHTNING_URL = process.env.SF_BASE_LIGHTNING_URL

const parse = function (jsonData) {  
  const data = JSON.parse(jsonData);
  const response = [];
  for (let i = 0; i < data.records.length; i++) {
    const record = data.records[i]
    response.push((i+1) + RECORD_DIVIDER);    
    response.push('Name: ' + record.Name);
    if(record.Status__c) {
      response.push('Status: ' + record.Status__c);
    }
    if(record.Total_Project_Amount__c) {
      response.push('Total_Project_Amount: ' + formatCurrency(record.Total_Project_Amount__c));
    }
    response.push('Create Date: ' + formatDate(record.CreatedDate));
    response.push('Last Modified Date: ' + formatDate(record.LastModifiedDate));
    const sfobject = record.attributes.type;
    const link = SF_BASE_LIGHTNING_URL + sfobject + '/' +  record.Id + '/view';    
    response.push(link);
    response.push('\n');    
  }
  
  return response;
}

const formatCurrency = function (amount) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  return formatter.format(amount);
}

const formatDate = function (isoDate) { 
  const date = new Date(isoDate); 
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).padStart(2, '0');
  return `${month}/${day}/${year}`; 
}



module.exports = { parse };