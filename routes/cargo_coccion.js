const express = require('express');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CargoCoccion:
 *       type: object
 *       required:
 *         - nombre_cargo
 *         - costo_cargo
 *       properties:
 *         id_cargo_coccion:
 *           type: integer
 *           description: ID del cargo de cocción
 *         nombre_cargo:
 *           type: string
 *           description: Nombre del cargo de cocción
 *         costo_cargo:
 *           type: number
 *           format: float
 *           description: Costo asociado al cargo de cocción
 */

/**
 * @swagger
 * /cargo_coccion:
 *   get:
 *     summary: Obtiene todos los cargos de cocción
 *     tags: [CargoCoccion]
 *     responses:
 *       200:
 *         description: Lista de cargos de cocción
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CargoCoccion'
 *       500:
 *         description: Error en el servidor
 */
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

/**
 * @swagger
 * /cargo_coccion/{id}:
 *   get:
 *     summary: Obtiene un cargo de cocción por ID
 *     tags: [CargoCoccion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cargo de cocción
 *     responses:
 *       200:
 *         description: Detalle del cargo de cocción encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CargoCoccion'
 *       404:
 *         description: Cargo de cocción no encontrado
 *       500:
 *         description: Error en el servidor
 */
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

/**
 * @swagger
 * /cargo_coccion:
 *   post:
 *     summary: Registra un nuevo cargo de cocción
 *     tags: [CargoCoccion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CargoCoccion'
 *     responses:
 *       201:
 *         description: Cargo de cocción creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id_cargo_coccion:
 *                   type: integer
 *       400:
 *         description: Todos los campos son obligatorios
 *       500:
 *         description: Error en el servidor
 */

// Registrar un nuevo cargo de cocción
router.post('/', (req, res) => {
    const { nombre_cargo, costo_cargo } = req.body;

    if (!nombre_cargo || !costo_cargo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = `INSERT INTO cargo_coccion (nombre_cargo, costo_cargo) VALUES (?, ?)`;

    req.db.query(sql, [nombre_cargo, costo_cargo], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Cargo de cocción creado exitosamente', id_cargo_coccion: result.insertId });
    });
});

/**
 * @swagger
 * /cargo_coccion/{id}:
 *   put:
 *     summary: Actualiza un cargo de cocción existente
 *     tags: [CargoCoccion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cargo de cocción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CargoCoccion'
 *     responses:
 *       200:
 *         description: Cargo de cocción actualizado exitosamente
 *       400:
 *         description: Todos los campos son obligatorios
 *       404:
 *         description: Cargo de cocción no encontrado
 *       500:
 *         description: Error en el servidor
 */
// Editar un cargo de cocción
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre_cargo, costo_cargo } = req.body;

    if (!nombre_cargo|| !costo_cargo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = `UPDATE cargo_coccion SET nombre_cargo = ?, costo_cargo = ? WHERE id_cargo_coccion = ?`;

    req.db.query(sql, [nombre_cargo, costo_cargo, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cargo de cocción no encontrado' });
        }
        res.status(200).json({ message: 'Cargo de cocción actualizado exitosamente' });
    });
});

/**
 * @swagger
 * /cargo_coccion/{id}:
 *   delete:
 *     summary: Elimina un cargo de cocción
 *     tags: [CargoCoccion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cargo de cocción
 *     responses:
 *       200:
 *         description: Cargo de cocción eliminado exitosamente
 *       404:
 *         description: Cargo de cocción no encontrado
 *       500:
 *         description: Error en el servidor
 */
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