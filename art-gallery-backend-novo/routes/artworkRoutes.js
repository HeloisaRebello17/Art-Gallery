// art-gallery-backend-novo/routes/artworkRoutes.js
const express = require('express');
const router = express.Router();
const artworkController = require('../controllers/artworkController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Rotas Públicas
router.get('/', artworkController.getAllArtworks);
router.get('/:id', artworkController.getArtworkById);

// Rotas Protegidas (Admin)
router.post('/', protect, isAdmin, artworkController.createArtwork);
router.put('/:id', protect, isAdmin, artworkController.updateArtwork);
router.delete('/:id', protect, isAdmin, artworkController.deleteArtwork);

module.exports = router;