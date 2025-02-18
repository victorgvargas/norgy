const mysql2 = require("mysql2");
const config = require("./config");

const connectDB = async () => {
  const useCloudDB = process.env.DB_URL ? true : false;

  const pool = useCloudDB ? mysql2.createPool(process.env.DB_URL) : mysql2.createPool(config);

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
