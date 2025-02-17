const { queryRecord } = require("../utils/sqlFunctions");

// Get user counters
const getUserCounters = async (req, res) => {
  const userId = req.user.userId; // Assume user is authenticated

  try {
    const query = "SELECT category, counter_value FROM user_counters WHERE userId = ?";
    const counters = await queryRecord(query, [userId]);

    res.status(200).json({ userId, counters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user counter (increment or decrement)
const updateUserCounter = async (req, res) => {
  const { userId } = req.user;
  const { category, amount } = req.body; // `amount` can be positive (increment) or negative (decrement)

  try {
    // Update user's counter
    const updateUserCounterQuery = `
      INSERT INTO user_counters (userId, category, counter_value) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE counter_value = counter_value + ?;
    `;
    await queryRecord(updateUserCounterQuery, [userId, category, amount, amount]);

    // Update global counter
    const updateGlobalCounterQuery = `
      INSERT INTO global_counters (category, total_counter) 
      VALUES (?, ?) 
      ON DUPLICATE KEY UPDATE total_counter = total_counter + ?;
    `;
    await queryRecord(updateGlobalCounterQuery, [category, amount, amount]);

    res.status(200).json({ message: "Counter updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get global counters
const getGlobalCounters = async (req, res) => {
  try {
    const query = "SELECT category, total_counter FROM global_counters";
    const counters = await queryRecord(query);

    res.status(200).json({ counters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetGlobalCounters = async (req, res) => {
    try {
      const resetQuery = "UPDATE global_counters SET total_counter = 0";
      await queryRecord(resetQuery);
  
      res.status(200).json({ message: "Global counters reset successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports = {
  getUserCounters,
  updateUserCounter,
  getGlobalCounters,
  resetGlobalCounters
};
