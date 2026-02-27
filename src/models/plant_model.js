const db = require("../config/database");

const Plant = {
  getAllWithLastReading: async () => {
    const query = `
      SELECT plants.*, readings.soil_percent, readings.timestamp 
      FROM plants 
      LEFT JOIN (
          SELECT plant_id, soil_percent, timestamp 
          FROM readings 
          WHERE id IN (SELECT MAX(id) FROM readings GROUP BY plant_id)
      ) AS readings ON plants.id = readings.plant_id
    `;
    const [rows] = await db.execute(query);
    return rows;
  },
  saveReading: async (plantId, percent) => {
    return await db.execute(
      "INSERT INTO readings (plant_id, soil_percent) VALUES (?, ?)",
      [plantId, percent],
    );
  },
  findByDeviceId: async (deviceId) => {
    const [rows] = await db.execute(
      "SELECT * FROM plants WHERE device_id = ?",
      [deviceId],
    );
    return rows[0];
  },
};

module.exports = Plant;
