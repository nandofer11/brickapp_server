const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Proveedor:
 *       type: object
 *       required:
 *         - tipo_documento
 *         - nro_documento
 *         - nombre
 *         - ciudad
 *       properties:
 *         id_proveedor:
 *           type: integer
 *           description: ID del proveedor
 *         tipo_documento:
 *           type: string
 *           description: Tipo de documento del proveedor (por ejemplo, DNI, RUC)
 *         nro_documento:
 *           type: string
 *           description: Número de documento del proveedor
 *         nombre:
 *           type: string
 *           description: Nombre del proveedor
 *         ciudad:
 *           type: string
 *           description: Ciudad donde se encuentra el proveedor
 *         telefono:
 *           type: string
 *           description: Teléfono del proveedor
 *         celular:
 *           type: string
 *           description: Celular del proveedor
 *         email:
 *           type: string
 *           description: Correo electrónico del proveedor
 */


/**
 * @swagger
 * /proveedores:
 *   get:
 *     summary: Obtener todos los proveedores
 *     tags: [Proveedores]
 *     responses:
 *       200:
 *         description: Lista de proveedores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_proveedor:
 *                     type: integer
 *                   tipo_documento:
 *                     type: string
 *                   nro_documento:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   ciudad:
 *                     type: string
 *                   telefono:
 *                     type: string
 *                   celular:
 *                     type: string
 *                   email:
 *                     type: string
 */

// Obtener todos los proveedores
router.get('/', proveedorController.getAll);

/**
 * @swagger
 * /proveedores/{id}:
 *   get:
 *     summary: Obtener un proveedor por ID
 *     tags: [Proveedores]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del proveedor a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proveedor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_proveedor:
 *                   type: integer
 *                 tipo_documento:
 *                   type: string
 *                 nro_documento:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 ciudad:
 *                   type: string
 *                 telefono:
 *                   type: string
 *                 celular:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Proveedor no encontrado
 */

// Obtener un proveedor por ID
router.get('/:id', proveedorController.getById);

/**
 * @swagger
 * /proveedores:
 *   post:
 *     summary: Crear un nuevo proveedor
 *     tags: [Proveedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo_documento:
 *                 type: string
 *               nro_documento:
 *                 type: string
 *               nombre:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               telefono:
 *                 type: string
 *               celular:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proveedor creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: integer
 *       500:
 *         description: Error al crear el proveedor
 */

// Crear un nuevo proveedor
router.post('/', proveedorController.register);

/**
 * @swagger
 * /proveedores/{id}:
 *   put:
 *     summary: Actualizar un proveedor por ID
 *     tags: [Proveedores]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del proveedor a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo_documento:
 *                 type: string
 *               nro_documento:
 *                 type: string
 *               nombre:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               telefono:
 *                 type: string
 *               celular:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proveedor actualizado con éxito
 *       404:
 *         description: Proveedor no encontrado
 *       500:
 *         description: Error al actualizar el proveedor
 */

// Actualizar un proveedor por ID
router.put('/:id', proveedorController.update);

/**
 * @swagger
 * /proveedores/{id}:
 *   delete:
 *     summary: Eliminar un proveedor por ID
 *     tags: [Proveedores]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del proveedor a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proveedor eliminado con éxito
 *       404:
 *         description: Proveedor no encontrado
 *       500:
 *         description: Error al eliminar el proveedor
 */

// Eliminar un proveedor por ID
router.delete('/:id', proveedorController.delete);

module.exports = router;
