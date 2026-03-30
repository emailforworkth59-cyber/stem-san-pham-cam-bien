const Plant = require("../models/plant_model");
const botMessage = require("./botMessega");

const plantController = {
  // Hiển thị giao diện Dashboard lần đầu
  // Hien thi giao dien Dashboard lan dau
  renderDashboard: async (req, res) => {
    try {
      // 1. Lay danh sach cac cay dang trong
      const plants = await Plant.getAllWithLastReading();

      // 2. Lay them danh sach danh muc cay (Menu) de hien thi form Them Cay
      const catalogs = await Plant.getCatalog();

      // 3. Truyen CA HAI bien nay sang file giao dien dashboard.ejs
      res.render("dashboard", { plants, catalogs });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getApiStatus: async (req, res) => {
    try {
      const plants = await Plant.getAllWithLastReading();
      res.json(plants);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  handleSensorData: async (req, res) => {
    const { device_id, soil_percent } = req.body;

    try {
      const plant = await Plant.findByDeviceId(device_id);

      if (plant) {
        await Plant.saveReading(plant.id, soil_percent);

        if (soil_percent < plant.min_threshold) {
          botMessage.guiThongBao(plant.plant_name, soil_percent, "KHO");
        } else if (soil_percent > plant.max_threshold) {
          botMessage.guiThongBao(plant.plant_name, soil_percent, "UOT");
        }
      }
      res.sendStatus(200);
    } catch (error) {
      console.error("Lỗi xử lý dữ liệu cảm biến:", error);
      res.sendStatus(500);
    }
  },
  // ... (Giu nguyen code cu o tren)

  // Ham cap nhat cau hinh min/max tu trang Dashboard
  updateThreshold: async (req, res) => {
    const { plant_id, min_threshold, max_threshold } = req.body;
    try {
      // Yeu cau: Can them ham updateThreshold vao models/plant_model.js
      await Plant.updateThreshold(plant_id, min_threshold, max_threshold);
      res.redirect("/");
    } catch (error) {
      console.error("Loi cap nhat cau hinh:", error);
      res.status(500).send("Loi he thong");
    }
  },

  // Ham hien thi Trang chon cay cho nong dan
  // Ham hien thi Trang chon cay cho nong dan
  renderPlantSelection: async (req, res) => {
    try {
      // Đọc danh mục cây từ database
      const catalogs = await Plant.getCatalog();

      res.render("plant_select", { catalogs });
    } catch (error) {
      console.error("Lỗi tải trang chọn cây:", error);
      res.status(500).send("Loi tai trang");
    }
  },

  // Ham xu ly khi nong dan bam Them cay
  // Ham xu ly khi nong dan bam Them cay
  addPlant: async (req, res) => {
    const { catalog_id, device_id } = req.body;

    if (!catalog_id || !device_id) {
      return res
        .status(400)
        .send("Lỗi: Vui lòng chọn loại cây và nhập mã thiết bị!");
    }

    const plant_name = "Tram " + device_id;

    try {
      // Đã bỏ user_id, chỉ truyền 3 tham số
      await Plant.createNewPlant(plant_name, device_id, catalog_id);
      res.redirect("/");
    } catch (error) {
      console.error("Loi them thiet bi vao DB:", error);
      res.status(500).send("Loi he thong khi luu vao CSDL");
    }
  },
  // Them ham nay vao trong plantController
  deletePlant: async (req, res) => {
    // Lay ID cua tram can xoa tu duong dan (URL)
    const plantId = req.params.id;

    try {
      await Plant.deletePlant(plantId); // Hoac land_model.deletePlant tuy ten ban goi
      // Xoa xong thi tu dong quay ve trang chu
      res.redirect("/");
    } catch (error) {
      console.error("Loi xoa thiet bi:", error);
      res.status(500).send("Loi he thong khi xoa tram");
    }
  },
};

module.exports = plantController;
