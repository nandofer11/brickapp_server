const express = require('express');
const router = express.Router();
const cargoCoccionController = require('../controllers/cargoCoccionController');

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
router.get('/', cargoCoccionController.list);

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
router.get('/:id', cargoCoccionController.getById);

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
router.post('/', cargoCoccionController.register);

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
router.put('/:id', cargoCoccionController.update);

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
router.delete('/:id', cargoCoccionController.delete);


module.exports = router;