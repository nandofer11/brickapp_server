const express = require('express');
const router = express.Router();
const PersonalController = require('../controllers/personalController');
const authenticateToken = require('../middlewares/authenticateToken');

/**
 * @swagger
 * /personal:
 *   post:
 *     summary: Registra un nuevo trabajador
 *     tags: [Personal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Personal'
 *     responses:
 *       200:
 *         description: Trabajador registrado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id_personal:
 *                   type: integer
 *       500:
 *         description: Error en el servidor
 */

// Ruta para registrar un trabajador
router.post('/', PersonalController.register);

/**
 * @swagger
 * /personal:
 *   get:
 *     summary: Obtiene todos los trabajadores
 *     tags: [Personal]
 *     responses:
 *       200:
 *         description: Lista de todos los trabajadores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Personal'
 *       500:
 *         description: Error en el servidor
 */

// Ruta para listar todos los trabajadores
router.get('/', PersonalController.list);

/**
 * @swagger
 * /personal/{id}:
 *   get:
 *     summary: Obtiene un trabajador por ID
 *     tags: [Personal]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del trabajador
 *     responses:
 *       200:
 *         description: Detalle del trabajador encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Personal'
 *       404:
 *         description: Trabajador no encontrado
 *       500:
 *         description: Error en el servidor
 */

// Ruta para obtener un solo trabajador por ID
router.get('/:id', PersonalController.getById);

/**
 * @swagger
 * /personal/{id}:
 *   put:
 *     summary: Actualiza un trabajador existente
 *     tags: [Personal]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del trabajador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Personal'
 *     responses:
 *       200:
 *         description: Trabajador actualizado con éxito
 *       404:
 *         description: Trabajador no encontrado o sin cambios
 *       500:
 *         description: Error en el servidor
 */

// Ruta para editar un trabajador
router.put('/:id', PersonalController.update);

/**
 * @swagger
 * /personal/{id}:
 *   delete:
 *     summary: Elimina un trabajador
 *     tags: [Personal]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del trabajador a eliminar
 *     responses:
 *       200:
 *         description: Trabajador eliminado con éxito
 *       404:
 *         description: Trabajador no encontrado
 *       500:
 *         description: Error en el servidor
 */

// Ruta para eliminar un trabajador
router.delete('/:id', PersonalController.delete);

// Exportar las rutas
module.exports = router;
