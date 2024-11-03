const express = require('express');
const router = express.Router();
const hornoController = require('../controllers/hornoController');

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
router.get('/', hornoController.list);

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
router.get('/:id', hornoController.getById);

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
router.post('/', hornoController.register);

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
router.put('/:id', hornoController.update);

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
router.delete('/:id', hornoController.delete);

module.exports = router;