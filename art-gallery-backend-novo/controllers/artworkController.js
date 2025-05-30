// art-gallery-backend-novo/controllers/artworkController.js
const db = require('../config/db');

// @desc    Criar uma nova obra de arte
// @route   POST /api/artworks
// @access  Privado/Admin
exports.createArtwork = async (req, res, next) => {
    const { Title, Description, CreationYear, Medium, Dimensions, ImageURL, ArtistID } = req.body;

    if (!Title) {
        return res.status(400).json({ error: 'O campo "Title" (título da obra) é obrigatório.' });
    }
    // Opcional: Validar se ArtistID existe, se fornecido
    if (ArtistID) {
        const [artists] = await db.query('SELECT ArtistID FROM Artists WHERE ArtistID = ?', [ArtistID]);
        if (artists.length === 0) {
            return res.status(404).json({ error: `Artista com ID ${ArtistID} não encontrado.` });
        }
    }

    try {
        const newArtwork = { Title, Description, CreationYear, Medium, Dimensions, ImageURL, ArtistID: ArtistID || null };
        const [result] = await db.query('INSERT INTO Artworks SET ?', newArtwork);

        res.status(201).json({
            message: 'Obra de arte criada com sucesso!',
            artworkId: result.insertId,
            ...newArtwork
        });
    } catch (error) {
        console.error('Erro ao criar obra de arte:', error);
        next(error);
    }
};

// @desc    Listar todas as obras de arte
// @route   GET /api/artworks
// @access  Público
exports.getAllArtworks = async (req, res, next) => {
    try {
        // Vamos fazer um JOIN para incluir o nome do artista
        const query = `
            SELECT 
                aw.*, 
                ar.Name AS ArtistName 
            FROM Artworks aw
            LEFT JOIN Artists ar ON aw.ArtistID = ar.ArtistID
            ORDER BY aw.Title ASC;
        `;
        const [artworks] = await db.query(query);
        res.json(artworks);
    } catch (error) {
        console.error('Erro ao listar obras de arte:', error);
        next(error);
    }
};

// @desc    Obter uma obra de arte específica pelo ID
// @route   GET /api/artworks/:id
// @access  Público
exports.getArtworkById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT 
                aw.*, 
                ar.Name AS ArtistName 
            FROM Artworks aw
            LEFT JOIN Artists ar ON aw.ArtistID = ar.ArtistID
            WHERE aw.ArtworkID = ?;
        `;
        const [artworks] = await db.query(query, [id]);

        if (artworks.length === 0) {
            return res.status(404).json({ error: 'Obra de arte não encontrada.' });
        }
        res.json(artworks[0]);
    } catch (error) {
        console.error(`Erro ao buscar obra de arte ${id}:`, error);
        next(error);
    }
};

// @desc    Atualizar uma obra de arte
// @route   PUT /api/artworks/:id
// @access  Privado/Admin
exports.updateArtwork = async (req, res, next) => {
    const { id } = req.params;
    const { Title, Description, CreationYear, Medium, Dimensions, ImageURL, ArtistID } = req.body;

    // Monta um objeto apenas com os campos que foram fornecidos para atualização
    const fieldsToUpdate = {};
    if (Title !== undefined) fieldsToUpdate.Title = Title;
    if (Description !== undefined) fieldsToUpdate.Description = Description;
    if (CreationYear !== undefined) fieldsToUpdate.CreationYear = CreationYear;
    if (Medium !== undefined) fieldsToUpdate.Medium = Medium;
    if (Dimensions !== undefined) fieldsToUpdate.Dimensions = Dimensions;
    if (ImageURL !== undefined) fieldsToUpdate.ImageURL = ImageURL;
    if (ArtistID !== undefined) {
         // Opcional: Validar se ArtistID existe, se fornecido para atualização
        if (ArtistID !== null) { // Permite desassociar passando null
            const [artists] = await db.query('SELECT ArtistID FROM Artists WHERE ArtistID = ?', [ArtistID]);
            if (artists.length === 0) {
                return res.status(404).json({ error: `Artista com ID ${ArtistID} não encontrado para associação.` });
            }
        }
        fieldsToUpdate.ArtistID = ArtistID;
    }


    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ error: 'Nenhum dado fornecido para atualização.' });
    }

    try {
        const [result] = await db.query('UPDATE Artworks SET ? WHERE ArtworkID = ?', [fieldsToUpdate, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Obra de arte não encontrada para atualização.' });
        }
         if (result.changedRows === 0 && result.affectedRows > 0) {
             return res.json({ message: 'Nenhum dado da obra foi alterado (valores iguais aos existentes).', artworkId: id });
        }

        res.json({ message: 'Obra de arte atualizada com sucesso!', artworkId: id, updatedFields: fieldsToUpdate });
    } catch (error) {
        console.error(`Erro ao atualizar obra de arte ${id}:`, error);
        next(error);
    }
};

// @desc    Deletar uma obra de arte
// @route   DELETE /api/artworks/:id
// @access  Privado/Admin
exports.deleteArtwork = async (req, res, next) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM Artworks WHERE ArtworkID = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Obra de arte não encontrada para exclusão.' });
        }
        res.status(200).json({ message: 'Obra de arte deletada com sucesso.', artworkId: id });
    } catch (error) {
        console.error(`Erro ao deletar obra de arte ${id}:`, error);
        next(error);
    }
};