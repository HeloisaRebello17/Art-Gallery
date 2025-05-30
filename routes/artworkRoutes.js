const express = require('express');
const router = express.Router();
const artworkController = require('../controllers/artworkController');

router.get('/', artworkController.getAllArtworks);
router.post('/', artworkController.createArtwork);

module.exports = router;