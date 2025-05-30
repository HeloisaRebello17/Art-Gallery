const db = require('../config/db');

exports.getAllArtworks = (req, res, next) => {
    const sql = `
        SELECT Aw.ArtworkID, Aw.Title, Aw.Description, Aw.CreationYear, Aw.Medium, Aw.Dimensions, Aw.ImageURL, Aw.ArtistID, Ar.Name AS ArtistName 
        FROM Artworks Aw 
        JOIN Artists Ar ON Aw.ArtistID = Ar.ArtistID`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar obras de arte:', err);
            return next(err);
        }
        res.json(results);
    });
};

exports.createArtwork = (req, res, next) => {
    const { Title, Description, CreationYear, Medium, Dimensions, ImageURL, ArtistID } = req.body;
    if (!Title || !ArtistID) {
        return res.status(400).json({ error: 'Título e ID do Artista são obrigatórios.' });
    }
    const sql = 'INSERT INTO Artworks (Title, Description, CreationYear, Medium, Dimensions, ImageURL, ArtistID) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [Title, Description, CreationYear, Medium, Dimensions, ImageURL, ArtistID], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar obra de arte:', err);
            return next(err);
        }
        res.status(201).json({ message: 'Obra de arte adicionada com sucesso!', artworkId: result.insertId });
    });
};