const express = require('express');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Horno:
 *       type: object
 *       required:
 *         - prefijo
 *         - nombre
 *         - cantidad_operadores
 *       properties:
 *         id_horno:
 *           type: integer
 *           description: ID del horno
 *         prefijo:
 *           type: string
 *           description: Prefijo del horno
 *         nombre:
 *           type: string
 *           description: Nombre del horno
 *         cantidad_operadores:
 *           type: integer
 *           description: Cantidad de operadores asignados al horno
 */

/**
 * @swagger
 * /hornos:
 *   get:
 *     summary: Obtiene todos los hornos
 *     tags: [Horno]
 *     responses:
 *       200:
 *         description: Lista de todos los hornos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Horno'
 *       500:
 *         description: Error en el servidor
 */

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

/**
 * @swagger
 * /hornos/{id}:
 *   get:
 *     summary: Obtiene un horno por ID
 *     tags: [Horno]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del horno
 *     responses:
 *       200:
 *         description: Detalle del horno encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Horno'
 *       404:
 *         description: Horno no encontrado
 *       500:
 *         description: Error en el servidor
 */

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

/**
 * @swagger
 * /hornos:
 *   post:
 *     summary: Crea un nuevo horno
 *     tags: [Horno]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Horno'
 *     responses:
 *       201:
 *         description: Horno creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id_horno:
 *                   type: integer
 *       400:
 *         description: Faltan campos obligatorios
 *       500:
 *         description: Error en el servidor
 */
// Crear un nuevo horno
router.post('/', (req, res) => {
    const { prefijo, nombre, cantidad_operadores } = req.body;

    if (!prefijo || !nombre || !cantidad_operadores) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = `INSERT INTO horno (prefijo, nombre, cantidad_operadores) VALUES (?, ?, ?)`;

    req.db.query(sql, [prefijo, nombre, cantidad_operadores], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Horno registrado exitosamente', id_horno: result.insertId });
    });
});

/**
 * @swagger
 * /hornos/{id}:
 *   put:
 *     summary: Actualiza un horno existente
 *     tags: [Horno]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del horno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Horno'
 *     responses:
 *       200:
 *         description: Horno actualizado exitosamente
 *       400:
 *         description: Faltan campos obligatorios
 *       404:
 *         description: Horno no encontrado
 *       500:
 *         description: Error en el servidor
 */
// Editar un horno
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { prefijo, nombre, cantidad_operadores } = req.body;

    if (!prefijo || !nombre || !cantidad_operadores) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = `UPDATE horno SET prefijo = ?, nombre = ?, cantidad_operadores = ? WHERE id_horno = ?`;

    req.db.query(sql, [prefijo, nombre, cantidad_operadores, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Horno no encontrado' });
        }
        res.status(200).json({ message: 'Horno actualizado exitosamente' });
    });
});

/**
 * @swagger
 * /hornos/{id}:
 *   delete:
 *     summary: Elimina un horno
 *     tags: [Horno]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del horno a eliminar
 *     responses:
 *       200:
 *         description: Horno eliminado exitosamente
 *       404:
 *         description: Horno no encontrado
 *       500:
 *         description: Error en el servidor
 */
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