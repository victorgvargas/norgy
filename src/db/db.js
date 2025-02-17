const mysql2 = require("mysql2");
const config = require("./config");

const connectDB = async () => {
  const pool = mysql2.createPool(config);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error({ error: err.message });
    } else {
      console.log("Connected to MySQL database");
      connection.release();
    }
  });
};

module.exports = connectDB;
