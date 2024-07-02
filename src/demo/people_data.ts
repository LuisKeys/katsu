/**
 * Retrieves a random first name from a predefined list of names.
 * @returns {string} A random first name.
 */
function getFirstName() {
  const names = ['John', 'Emma', 'Michael', 'Sophia', 'David', 'Olivia', 'Daniel', 'Ava', 'Matthew', 'Isabella', 'Ethan', 'Mia', 'Alexander', 'Charlotte', 'William', 'Amelia', 'James', 'Harper', 'Benjamin', 'Evelyn', 'Henry', 'Abigail', 'Joseph', 'Emily', 'Samuel', 'Elizabeth', 'Jackson', 'Sofia', 'Sebastian', 'Avery', 'Gabriel', 'Ella', 'Andrew', 'Scarlett', 'David', 'Grace', 'Carter', 'Chloe', 'John', 'Victoria', 'Luke', 'Riley', 'Owen', 'Lily', 'Jack', 'Aria', 'Wyatt', 'Zoe', 'Isaac', 'Penelope', 'Levi', 'Layla', 'Nathan', 'Nora', 'Caleb', 'Mila', 'Ryan', 'Aubrey', 'Daniel', 'Hannah', 'Hunter', 'Addison', 'Christian', 'Stella', 'Landon', 'Bella', 'Jonathan', 'Natalie', 'Nicholas', 'Maya', 'Elijah', 'Leah', 'Aaron', 'Lucy', 'Isaiah', 'Audrey', 'Thomas', 'Savannah', 'Charles', 'Brooklyn', 'Connor', 'Zoey', 'Josiah', 'Claire', 'Eli', 'Eleanor', 'Ezra', 'Skylar', 'Colton', 'Ellie', 'Adrian', 'Samantha', 'Asher', 'Violet', 'Jordan', 'Lillian', 'Dominic', 'Anna', 'Austin', 'Paisley', 'Robert', 'Aaliyah', 'Angel', 'Gabriella', 'Adam', 'Allison', 'Xavier', 'Serenity', 'Jose', 'Samantha', 'Ian', 'Camila', 'Cooper', 'Ariana', 'Carson', 'Arianna', 'Jaxon', 'Sarah'];
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}

/**
 * Retrieves a random last name from a predefined list of last names.
 * @returns {string} A random last name.
 */
function getLastName() {
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy', 'Bailey', 'Rivera', 'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward', 'Torres', 'Peterson', 'Gray', 'Ramirez', 'James', 'Watson', 'Brooks', 'Kelly', 'Sanders', 'Price', 'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Hughes', 'Flores', 'Washington', 'Butler', 'Simmons', 'Foster', 'Gonzales', 'Bryant', 'Alexander', 'Russell', 'Griffin', 'Diaz', 'Hayes'];
  const randomIndex = Math.floor(Math.random() * lastNames.length);
  return lastNames[randomIndex];
}

/**
 * Generates a random dummy US phone number.
 * @returns {string} The random phone number.
 */
function getPhone() {
  const areaCode = Math.floor(Math.random() * (999 - 200 + 1) + 200);
  const firstThreeDigits = Math.floor(Math.random() * 1000);
  const lastFourDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `+1 (${areaCode}) ${firstThreeDigits}-${lastFourDigits}`;
}

export {   
  getFirstName,
  getLastName,
  getPhone
};