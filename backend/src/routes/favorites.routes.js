const favoritesController = require('../controllers/favorites.controller');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware'); // JWT verification

//middleware 'auth' ensures the user come's from a logged-in user
router.get('/getFavorites', auth, favoritesController.getFavorites);
//'auth' verifies the user's identity using JWT
router.post('/addfav', auth, favoritesController.addFavorites);
//'auth' ensures that only the authenticated user can modify their favorites
router.delete('/deleteEv/:title', auth, favoritesController.removeFavorites);//need the id because the user deletes one specific event from the list

module.exports = router;