const Plant = require("../models/plant_model");
const botMessage = require("./botMessega");

const plantController = {
  renderDashboard: async (req, res) => {
    try {
      const plants = await Plant.getAllWithLastReading();
      const catalogs = await Plant.getCatalog();
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
      const plants = await Plant.findAllByDeviceId(device_id);

      if (plants && plants.length > 0) {
        for (const plant of plants) {
          await Plant.saveReading(plant.id, soil_percent);
          if (soil_percent < plant.min_threshold) {
            botMessage.guiThongBao(plant.plant_name, soil_percent, "KHO");
            console.log("KHo");
          } else if (soil_percent > plant.max_threshold) {
            botMessage.guiThongBao(plant.plant_name, soil_percent, "UOT");
            console.log("Uot");
          }
        }
      }
      res.sendStatus(200);
    } catch (error) {
      console.error("Loi xu ly du lieu cam bien:", error);
      res.sendStatus(500);
    }
  },
  updateThreshold: async (req, res) => {
    // Lấy id từ URL params và min/max từ form body
    const { id } = req.params;
    const { min_threshold, max_threshold } = req.body;

    try {
      // Truyền id vào hàm update của Model
      await Plant.updateThreshold(id, min_threshold, max_threshold);
      res.redirect("/");
    } catch (error) {
      console.error("Loi cap nhat cau hinh:", error);
      res.status(500).send("Loi he thong khi cap nhat nguong");
    }
  },

  renderPlantSelection: async (req, res) => {
    try {
      const catalogs = await Plant.getCatalog();

      res.render("plant_select", { catalogs });
    } catch (error) {
      console.error("Lỗi tải trang chọn cây:", error);
      res.status(500).send("Loi tai trang");
    }
  },

  addPlant: async (req, res) => {
    const { catalog_id, device_id } = req.body;

    if (!catalog_id || !device_id) {
      return res
        .status(400)
        .send("Lỗi: Vui lòng chọn loại cây và nhập mã thiết bị!");
    }

    const plant_name = "Tram " + device_id;

    try {
      await Plant.createNewPlant(plant_name, device_id, catalog_id);
      res.redirect("/");
    } catch (error) {
      console.error("Loi them thiet bi vao DB:", error);
      res.status(500).send("Loi he thong khi luu vao CSDL");
    }
  },

  deletePlant: async (req, res) => {
    const plantId = req.params.id;

    try {
      await Plant.deletePlant(plantId);
      res.redirect("/");
    } catch (error) {
      console.error("Loi xoa thiet bi:", error);
      res.status(500).send("Loi he thong khi xoa tram");
    }
  },
};

module.exports = plantController;
