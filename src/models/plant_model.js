const db = require("../config/database");

const Plant = {
  // Lấy toàn bộ danh sách trạm và dữ liệu mới nhất
  getAllWithLastReading: async () => {
    const query = `
      SELECT 
        p.*, 
        c.image_url, 
        c.type_name,
        r.soil_percent
      FROM plants p
      LEFT JOIN plant_catalog c ON p.catalog_id = c.id
      LEFT JOIN (
          SELECT plant_id, soil_percent 
          FROM readings 
          WHERE id IN (SELECT MAX(id) FROM readings GROUP BY plant_id)
      ) AS r ON p.id = r.plant_id
    `;
    const [rows] = await db.execute(query);
    return rows;
  },

  // Tìm các trạm theo ID thiết bị (Dùng cho ESP32 đẩy dữ liệu lên)
  findAllByDeviceId: async (device_id) => {
    const query = "SELECT * FROM plants WHERE device_id = ?";
    const [rows] = await db.execute(query, [device_id]);
    return rows;
  },

  // Lưu dữ liệu cảm biến
  saveReading: async (plantId, percent) => {
    const query = "INSERT INTO readings (plant_id, soil_percent) VALUES (?, ?)";
    return await db.execute(query, [plantId, percent]);
  },

  // Cập nhật ngưỡng trực tiếp từ Web
  updateThreshold: async (id, min, max) => {
    const query =
      "UPDATE plants SET min_threshold = ?, max_threshold = ? WHERE id = ?";
    return await db.execute(query, [min, max, id]);
  },

  // Tạo trạm mới
  createNewPlant: async (plantName, deviceId, catalogId) => {
    const query = `
      INSERT INTO plants (plant_name, device_id, catalog_id, min_threshold, max_threshold) 
      SELECT ?, ?, id, default_min, default_max 
      FROM plant_catalog 
      WHERE id = ?
    `;
    return await db.execute(query, [plantName, deviceId, catalogId]);
  },

  // Lấy danh mục cây trồng
  getCatalog: async () => {
    const [rows] = await db.execute("SELECT * FROM plant_catalog");
    return rows;
  },

  // Xóa trạm và lịch sử
  deletePlant: async (plantId) => {
    await db.execute("DELETE FROM readings WHERE plant_id = ?", [plantId]);
    return await db.execute("DELETE FROM plants WHERE id = ?", [plantId]);
  },
};

module.exports = Plant;
