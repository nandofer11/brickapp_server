const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Material:
 *       type: object
 *       required:
 *         - nombreMaterial
 *         - presentacion
 *       properties:
 *         id_material:
 *           type: integer
 *           description: ID del material
 *         nombreMaterial:
 *           type: string
 *           description: nombreMaterial del material
 *         presentacion:
 *           type: string
 *           description: Presentación del material
 */

/**
 * @swagger
 * /materiales:
 *   get:
 *     summary: Obtiene todos los materiales
 *     tags: [Material]
 *     responses:
 *       200:
 *         description: Lista de materiales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Material'
 */

// Obtener todos los materiales
router.get('/', materialController.getAll);


/**
 * @swagger
 * /materiales/{id}:
 *   get:
 *     summary: Obtiene un material por ID
 *     tags: [Material]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del material
 *     responses:
 *       200:
 *         description: Material encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Material'
 *       404:
 *         description: Material no encontrado
 */

// Obtener un material por ID
router.get('/:id', materialController.getById);

/**
 * @swagger
 * /materiales:
 *   post:
 *     summary: Crea un nuevo material
 *     tags: [Material]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Material'
 *     responses:
 *       201:
 *         description: Material creado exitosamente
 */

// Crear un nuevo material
router.post('/', materialController.register);

// Actualizar un material
router.put('/:id', materialController.update);

// Eliminar un material
router.delete('/:id', materialController.delete);

module.exports = router;
