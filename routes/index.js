// backend/routes/index.js
const express = require('express');
const router = express.Router();

// Importe seus arquivos de rota individuais
const userRoutes = require('./userRoutes');
const notificationRoutes = require('./notificationRoutes');
const activityRoutes = require('./activityRoutes');
const artistRoutes = require('./artistRoutes');
const artworkRoutes = require('./artworkRoutes');

// Defina os prefixos para cada conjunto de rotas
router.use('/users', userRoutes);
router.use('/notifications', notificationRoutes);
router.use('/activities', activityRoutes);
router.use('/artists', artistRoutes);
router.use('/artworks', artworkRoutes);

// Uma rota raiz para a API (opcional, para teste)
router.get('/', (req, res) => {
    res.json({ message: 'API da Art Gallery está operacional!' });
});

module.exports = router;