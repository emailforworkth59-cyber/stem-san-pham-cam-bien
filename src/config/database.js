const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: "localhost",
  user: "plant_user",
  password: "123456",
  database: "iot_soil_moisture",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool.promise();
