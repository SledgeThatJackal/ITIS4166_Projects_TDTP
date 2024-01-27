const express = require('express');
const controller = require("../controllers/connectionController");
const{currentlyLoggedIn, isHost} = require('../middlewares/authentication');
const{idValidate, connectionValidate, resultValidate} = require('../middlewares/validate');

const router = express.Router();

router.get("/", controller.connections);

router.get("/newConnection", currentlyLoggedIn, controller.newConnection);

router.post("/", currentlyLoggedIn, resultValidate, connectionValidate, controller.createConnection);

router.get("/:id", idValidate, controller.showConnection);

router.get("/:id/editconnection", idValidate, currentlyLoggedIn, isHost, controller.editConnection);

router.put("/:id", idValidate, currentlyLoggedIn, resultValidate, connectionValidate, isHost, controller.updateConnection);

router.delete("/:id", idValidate, currentlyLoggedIn, isHost, controller.deleteConnection);

router.post('/:id/rsvp', idValidate, currentlyLoggedIn, controller.rsvpConnection);

module.exports = router;