const userSchema = `
  CREATE TABLE IF NOT EXISTS users (
      userId VARCHAR(255) UNIQUE NOT NULL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255)
  )
`;

module.exports = userSchema;