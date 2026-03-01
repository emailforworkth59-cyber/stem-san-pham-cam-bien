const Plant = require("../models/plant_model");
const botMessage = require("./botMessega");

const plantController = {
  renderDashboard: async (req, res) => {
    try {
      const plants = await Plant.getAllWithLastReading();
      res.render("dashboard", { plants });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  getApiStatus: async (req, res) => {
    try {
      const plants = await Plant.getAllWithLastReading();
      res.json(plants); // Trả về JSON để JavaScript xử lý
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  //   if (soil_percent < plant.min_threshold) {
  //
  // }
  handleSensorData: async (req, res) => {
    const { device_id, soil_percent } = req.body;
    try {
      const plant = await Plant.findByDeviceId(device_id);
      if (plant) {
        await Plant.saveReading(plant.id, soil_percent);
        if (soil_percent < plant.min_threshold)
          botMessage.sendWarning(plant.plant_name, soil_percent);
        else if (soil_percent > plant.max_threshold)
          botMessage.sendWarning(plant.plant_name, soil_percent);
      }
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
};

module.exports = plantController;
