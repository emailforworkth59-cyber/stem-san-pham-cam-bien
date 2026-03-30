const db = require("../config/database");

const Plant = {
  getAllWithLastReading: async () => {
    const query = `
      SELECT 
        p.*, 
        c.image_url, 
        c.type_name,
        r.soil_percent, 
        r.timestamp 
      FROM plants p
      LEFT JOIN plant_catalog c ON p.catalog_id = c.id
      LEFT JOIN (
          SELECT plant_id, soil_percent, timestamp 
          FROM readings 
          WHERE id IN (SELECT MAX(id) FROM readings GROUP BY plant_id)
      ) AS r ON p.id = r.plant_id
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
  createNewPlant: async (plantName, deviceId, catalogId) => {
    // Bỏ userId ở đây
    const query = `
      INSERT INTO plants (plant_name, device_id, catalog_id, min_threshold, max_threshold) 
      SELECT ?, ?, id, default_min, default_max 
      FROM plant_catalog 
      WHERE id = ?
    `;
    // Bỏ userId trong mảng truyền vào
    return await db.execute(query, [plantName, deviceId, catalogId]);
  },
  getCatalog: async () => {
    const [rows] = await db.execute("SELECT * FROM plant_catalog");
    return rows;
  },
  updateThreshold: async (plantId, minThreshold, maxThreshold) => {
    return await db.execute(
      "UPDATE plants SET min_threshold = ?, max_threshold = ? WHERE id = ?",
      [minThreshold, maxThreshold, plantId],
    );
  },
  deletePlant: async (plantId) => {
    // Xoa lich su do
    await db.execute("DELETE FROM readings WHERE plant_id = ?", [plantId]);

    // Xoa tram
    return await db.execute("DELETE FROM plants WHERE id = ?", [plantId]);
  },
};

module.exports = Plant;
