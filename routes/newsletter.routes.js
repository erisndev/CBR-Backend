// routes/newsletterRoutes.js
const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");
const controller = require("../controllers/newsletter.controller");

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", upload.single("image"), controller.create);
router.put("/:id", upload.single("image"), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
