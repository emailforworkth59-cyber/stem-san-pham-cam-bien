const express = require("express");
const router = express.Router();

const plantController = require("../controllers/plantControllers");
const authController = require("../controllers/authControllers");
const isAuth = require("../middleware/authMiddlewares");
router.get("/login", authController.renderAuth);
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/logout", authController.logout);
router.get("/", isAuth, plantController.renderDashboard);
router.post("/update-threshold", isAuth, plantController.updateThreshold);
router.get("/plants/select", isAuth, plantController.renderPlantSelection);
router.post("/plants/add", isAuth, plantController.addPlant);

router.post("/api/sensor-data", plantController.handleSensorData);
router.get("/api/plants-status", plantController.getApiStatus);
// Dinh tuyen cho chuc nang xoa tram
router.post("/plants/delete/:id", plantController.deletePlant);
module.exports = router;
