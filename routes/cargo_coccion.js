const express = require('express');
const router = express.Router();

// Listar todos los cargos de cocción
router.get('/', (req, res) => {
    const sql = `SELECT * FROM cargo_coccion`;

    req.db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// Obtener un solo cargo de cocción por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM cargo_coccion WHERE id_cargo_coccion = ?`;

    req.db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Cargo de cocción no encontrado' });
        }
        res.status(200).json(result[0]);
    });
});

// Crear un nuevo cargo de cocción
router.post('/', (req, res) => {
    const { nombre, costo } = req.body;

    if (!nombre || !costo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = `INSERT INTO cargo_coccion (nombre, costo) VALUES (?, ?)`;

    req.db.query(sql, [nombre, costo], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Cargo de cocción creado exitosamente', id_cargo_coccion: result.insertId });
    });
});

// Editar un cargo de cocción
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, costo } = req.body;

    if (!nombre || !costo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = `UPDATE cargo_coccion SET nombre = ?, costo = ? WHERE id_cargo_coccion = ?`;

    req.db.query(sql, [nombre, costo, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cargo de cocción no encontrado' });
        }
        res.status(200).json({ message: 'Cargo de cocción actualizado exitosamente' });
    });
});

// Eliminar un cargo de cocción
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM cargo_coccion WHERE id_cargo_coccion = ?`;

    req.db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cargo de cocción no encontrado' });
        }
        res.status(200).json({ message: 'Cargo de cocción eliminado exitosamente' });
    });
});


module.exports = router;