const express = require('express');
const router = express.Router()// Tu archivo de configuración de base de datos

// Registrar una nueva cocción
router.post('/', (req, res) => {
    const { fecha_encendido, hora_inicio, humedad_inicial, horno_id_horno, usuario_id_usuario } = req.body;
    const sql = `INSERT INTO coccion (fecha_encendido, hora_inicio, humedad_inicial, horno_id_horno, usuario_id_usuario, estado) VALUES (?, ?, ?, ?, ?, 'En proceso')`;

    req.db.query(sql, [fecha_encendido, hora_inicio, humedad_inicial, horno_id_horno, usuario_id_usuario], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Cocción registrada', id: result.insertId });
    });
});

// Editar una cocción
router.put('/:id', (req, res) => {
    const { fecha_apagado, hora_fin, estado, humedad_inicial, horno_id_horno, usuario_id_usuario } = req.body;
    const { id } = req.params;
    const sql = `UPDATE coccion SET fecha_apagado = ?, hora_fin = ?, estado = ?, humedad_inicial = ?, horno_id_horno = ?, usuario_id_usuario = ? WHERE id_coccion = ?`;

    req.db.query(sql, [fecha_apagado, hora_fin, estado, humedad_inicial, horno_id_horno, usuario_id_usuario, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Cocción actualizada' });
    });
});

// Eliminar una cocción
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM coccion WHERE id_coccion = ?`;

    req.db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Cocción eliminada' });
    });
});

// Listar todas las cocciones
router.get('/', (req, res) => {
    const sql = `  SELECT coccion.*, horno.nombre AS nombre_horno, horno.prefijo
        FROM coccion
        JOIN horno ON coccion.horno_id_horno = horno.id_horno`;

    req.db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// Obtener una sola cocción por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM coccion WHERE id_coccion = ?`;

    req.db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Cocción no encontrada' });
        }
        res.status(200).json(result[0]);
    });
});

module.exports = router;
