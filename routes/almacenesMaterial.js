const express = require('express');
const router = express.Router()// Tu archivo de configuración de base de datos

/**
 * @swagger
 * components:
 *   schemas:
 *     Almacen:
 *       type: object
 *       required:
 *         - codigoAlmacen
 *         - nombreAlmacen
 *       properties:
 *         id_almacen:
 *           type: integer
 *           description: ID del almacén
 *         codigoAlmacen:
 *           type: string
 *           description: Código del almacén
 *         nombreAlmacen:
 *           type: string
 *           description: Nombre del almacén
 */

/**
 * @swagger
 * /almacenes:
 *   post:
 *     summary: Registrar un nuevo almacén
 *     tags: [Almacen]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Almacen'
 *     responses:
 *       201:
 *         description: Almacén registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_almacen:
 *                   type: integer
 *                 message:
 *                   type: string
 *                   example: 'Almacén registrado correctamente'
 *       500:
 *         description: Error al registrar el almacén
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
//Registrar un nuevo almacén
router.post('/', (req, res) => {
    const { codigoAlmacen, nombreAlmacen } = req.body;

    const sql = `INSERT INTO almacen (codigo_almacen, nombre_almacen) VALUES (?, ?)`
    req.db.query(sql, [codigoAlmacen, nombreAlmacen], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send({ id_almacen: result.insertId, message: "Almacén registrado correctamente" });
    });
});
/**
 * @swagger
 * /almacenes:
 *   get:
 *     summary: Obtener todos los almacenes
 *     tags: [Almacen]
 *     responses:
 *       200:
 *         description: Lista de almacenes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Almacen'
 *       500:
 *         description: Error al obtener los almacenes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
//Obtener todos los almacenes
router.get('/', (req, res) => {
    const sql = "SELECT * from almacen";

    req.db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(results);
    });
});

/**
 * @swagger
 * /almacenes/{id}:
 *   put:
 *     summary: Editar un almacén existente
 *     tags: [Almacen]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del almacén a editar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Almacen'
 *     responses:
 *       200:
 *         description: Almacén actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Almacén actualizado correctamente'
 *       404:
 *         description: Almacén no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Almacén no encontrado'
 *       500:
 *         description: Error al actualizar el almacén
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

// Editar un almacén existente
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { codigoAlmacen, nombreAlmacen } = req.body;

    const sql = `UPDATE almacen SET codigo_almacen = ?, nombre_almacen = ? WHERE id_almacen = ?`;
    req.db.query(sql, [codigoAlmacen, nombreAlmacen, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "Almacén no encontrado" });
        }
        res.send({ message: "Almacén actualizado correctamente" });
    });
});

/**
 * @swagger
 * /almacenes/{id}:
 *   delete:
 *     summary: Eliminar un almacén
 *     tags: [Almacen]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del almacén a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Almacén eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Almacén eliminado correctamente'
 *       404:
 *         description: Almacén no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Almacén no encontrado'
 *       500:
 *         description: Error al eliminar el almacén
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
// Eliminar un almacén
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM almacen WHERE id_almacen = ?`;
    req.db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "Almacén no encontrado" });
        }
        res.send({ message: "Almacén eliminado correctamente" });
    });
});

module.exports = router;