const userController = require('../controllers/auth.controller');
const express = require('express');
const router = express.Router();

//Handles new User registration request
//when a post request is made to '/register' it calls 'userController.register'
router.post('/register', userController.register);

//handles existing user login requests
//when a post request is made to '/login' it calls 'userController.login'
router.post('/login', userController.login);

module.exports = router;