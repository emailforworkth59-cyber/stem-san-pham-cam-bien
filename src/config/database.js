const mysql = require("mysql2");
require("dotenv").config();
const config = process.env;
const pool = mysql.createPool({
  host: config.HOST,
  user: config.DATABASE_USER,
  password: config.DATABASE_PASSWORD,
  database: config.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool.promise();
