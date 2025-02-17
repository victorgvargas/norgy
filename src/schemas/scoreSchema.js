const userCountersSchema = `
  CREATE TABLE IF NOT EXISTS user_counters (
    userId VARCHAR(36) NOT NULL,
    category VARCHAR(50) NOT NULL,
    counter_value INT DEFAULT 0,
    PRIMARY KEY (userId, category),
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
  );
`;

const globalCountersSchema = `
  CREATE TABLE IF NOT EXISTS global_counters (
    category VARCHAR(50) PRIMARY KEY,
    total_counter INT DEFAULT 0
  );
`;

module.exports = { userCountersSchema, globalCountersSchema };
