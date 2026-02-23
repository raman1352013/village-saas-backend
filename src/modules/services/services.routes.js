const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth.middleware");
const servicesController = require("./services.controller");

router.post("/", verifyToken, servicesController.createService);
router.get("/", servicesController.getServices);
router.post("/:id/apply", verifyToken, servicesController.applyService);
module.exports = router;