const express = require('express');
const router = express.Router();

// Listar todos los hornos
router.get('/', (req, res) => {
    const sql = `SELECT * FROM horno`;

    req.db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// Obtener un solo horno por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM horno WHERE id_horno = ?`;

    req.db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Horno no encontrado' });
        }
        res.status(200).json(result[0]);
    });
});

// Crear un nuevo horno
router.post('/', (req, res) => {
    const { prefijo, nombre } = req.body;

    if (!prefijo || !nombre) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = `INSERT INTO horno (prefijo, nombre) VALUES (?, ?)`;

    req.db.query(sql, [prefijo, nombre], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Horno creado exitosamente', id_horno: result.insertId });
    });
});

// Editar un horno
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { prefijo, nombre } = req.body;

    if (!prefijo || !nombre) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = `UPDATE horno SET prefijo = ?, nombre = ? WHERE id_horno = ?`;

    req.db.query(sql, [prefijo, nombre, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Horno no encontrado' });
        }
        res.status(200).json({ message: 'Horno actualizado exitosamente' });
    });
});

// Eliminar un horno
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM horno WHERE id_horno = ?`;

    req.db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Horno no encontrado' });
        }
        res.status(200).json({ message: 'Horno eliminado exitosamente' });
    });
});


module.exports = router;