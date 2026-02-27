const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plantControllers");

router.get("/", plantController.renderDashboard);
router.post("/api/sensor-data", plantController.handleSensorData);

module.exports = router;
