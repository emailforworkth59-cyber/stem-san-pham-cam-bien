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
router.post("/api/sensor-data", plantController.handleSensorData);

module.exports = router;
