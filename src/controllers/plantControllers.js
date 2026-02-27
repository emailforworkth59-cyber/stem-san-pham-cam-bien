const Plant = require("../models/plant_model");

const plantController = {
  renderDashboard: async (req, res) => {
    try {
      const plants = await Plant.getAllWithLastReading();
      res.render("dashboard", { plants });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  handleSensorData: async (req, res) => {
    const { device_id, soil_percent } = req.body;
    try {
      const plant = await Plant.findByDeviceId(device_id);
      if (plant) {
        await Plant.saveReading(plant.id, soil_percent);
        if (soil_percent < plant.min_threshold)
          console.log(`⚠️ ${plant.plant_name} QUÁ KHÔ!`);
        else if (soil_percent > plant.max_threshold)
          console.log(`⚠️ ${plant.plant_name} QUÁ ƯỚT!`);
      }
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
};

module.exports = plantController;
