const db = require('../config/db');

exports.getAllArtists = (req, res, next) => {
    const sql = 'SELECT ArtistID, Name, Biography, Nationality, BirthYear, DeceasedYear FROM Artists';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar artistas:', err);
            return next(err);
        }
        res.json(results);
    });
};

exports.createArtist = (req, res, next) => {
    const { Name, Biography, Nationality, BirthYear, DeceasedYear } = req.body;
    if (!Name) {
        return res.status(400).json({ error: 'Nome do artista é obrigatório.' });
    }
    const sql = 'INSERT INTO Artists (Name, Biography, Nationality, BirthYear, DeceasedYear) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [Name, Biography, Nationality, BirthYear, DeceasedYear], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar artista:', err);
            return next(err);
        }
        res.status(201).json({ message: 'Artista adicionado com sucesso!', artistId: result.insertId });
    });
};