const express = require('express');
const router = express.Router();
const controller = require("../controllers/generalController");

router.get("/", controller.home);

router.get("/contact", controller.contact);

router.get("/about", controller.about);

module.exports = router;