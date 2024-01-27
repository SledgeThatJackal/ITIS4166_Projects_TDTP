const express = require('express');
const controller = require('../controllers/userController');
const {guest, currentlyLoggedIn} = require('../middlewares/authentication');
const {limiter} = require('../middlewares/rateLimit');
const {signupValidate, loginValidate, resultValidate} = require('../middlewares/validate')

const router = express.Router();

router.get('/signup', guest, controller.signup);

router.post('/', guest, signupValidate, resultValidate, controller.createUser);

router.get('/login', guest, controller.getLogin);

router.post('/login', limiter, guest, loginValidate, resultValidate, controller.login);

router.get('/profile', currentlyLoggedIn, controller.profile);

router.get('/logout', currentlyLoggedIn, controller.logout);

module.exports = router;