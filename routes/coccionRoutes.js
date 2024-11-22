const express = require('express');
const router = express.Router()// Tu archivo de configuración de base de datos
const coccionController = require('../controllers/coccionController');


/**
 * @swagger
 * components:
 *   schemas:
 *     Coccion:
 *       type: object
 *       required:
 *         - fecha_encendido
 *         - hora_inicio
 *         - horno_id_horno
 *       properties:
 *         id_coccion:
 *           type: integer
 *           description: ID de la cocción
 *         fecha_encendido:
 *           type: string
 *           format: date
 *           description: Fecha en la que se encendió la cocción
 *         hora_inicio:
 *           type: string
 *           format: time
 *           description: Hora de inicio de la cocción
 *         fecha_apagado:
 *           type: string
 *           format: date
 *           description: Fecha en la que se apagó la cocción (opcional)
 *         hora_fin:
 *           type: string
 *           format: time
 *           description: Hora de fin de la cocción (opcional)
 *         humedad_inicial:
 *           type: number
 *           format: float
 *           description: Humedad inicial de la cocción
 *         estado:
 *           type: string
 *           description: Estado de la cocción (opcional)
 *         horno_id_horno:
 *           type: integer
 *           description: ID del horno asociado a la cocción
 *         usuario_id_usuario:
 *           type: integer
 *           description: ID del usuario que registra la cocción (opcional)
 *         operadoresCoccion:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               cargo_coccion_id_cargo_coccion:
 *                 type: integer
 *                 description: ID del cargo del operador
 *               abastecedor_id_abastecedor:
 *                 type: integer
 *                 description: ID del abastecedor (opcional)
 *               material_id_material:
 *                 type: integer
 *                 description: ID del material utilizado (opcional)
 *               cantidad_usada:
 *                 type: number
 *                 format: float
 *                 description: Cantidad de material utilizada (opcional)
 *               personal_id_personal:
 *                 type: integer
 *                 description: ID del personal involucrado
 */

/**
 * @swagger
 * /cocciones:
 *   post:
 *     summary: Registrar una nueva cocción
 *     tags: [Coccion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coccion'
 *     responses:
 *       201:
 *         description: Cocción registrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Cocción y operadores registrados correctamente'
 *                 coccionId:
 *                   type: integer
 *       500:
 *         description: Error al registrar la cocción
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

// Registrar una nueva cocción y los operadores de cocción asociados
router.post('/', coccionController.register);


/**
 * @swagger
 * /cocciones/{id}:
 *   put:
 *     summary: Editar una cocción
 *     tags: [Coccion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la cocción a editar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coccion'
 *     responses:
 *       200:
 *         description: Cocción actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Cocción actualizada'
 *       404:
 *         description: Cocción no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Cocción no encontrada'
 *       500:
 *         description: Error al actualizar la cocción
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

// Editar una cocción
router.put('/:id', coccionController.update);

/**
 * @swagger
 * /cocciones/{id}:
 *   delete:
 *     summary: Eliminar una cocción
 *     tags: [Coccion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la cocción a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cocción eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Cocción eliminada'
 *       404:
 *         description: Cocción no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Cocción no encontrada'
 *       500:
 *         description: Error al eliminar la cocción
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
// Eliminar una cocción
router.delete('/:id', coccionController.delete);


/**
 * @swagger
 * /cocciones:
 *   get:
 *     summary: Listar todas las cocciones
 *     tags: [Coccion]
 *     responses:
 *       200:
 *         description: Lista de cocciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Coccion'
 */
// Listar todas las cocciones
router.get('/', coccionController.getAll);

/**
 * @swagger
 * /cocciones/{id}:
 *   get:
 *     summary: Obtener una cocción por ID
 *     tags: [Coccion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la cocción a recuperar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cocción encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coccion'
 *       404:
 *         description: Cocción no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Cocción no encontrada'
 *       500:
 *         description: Error al recuperar la cocción
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
// Obtener una sola cocción por ID
router.get('/:id', coccionController.getById);

router.get('/:id/detalles', coccionController.getCoccionDetails);

// Ruta para obtener cocción en curso en el horno H2
router.get('/horno/H2/encurso', coccionController.getCoccionEnCurso);

// Ruta para iniciar la quema con humeada
router.put('/iniciarcoccion/:id', coccionController.actualizarEstadoCoccion);

// Ruta para cambiar el proceso de humeada a quema
router.put('/cambiar_quema/:id', coccionController.cambiarProcesoQuema);

// Ruta para finalizar la cocción
router.put('/finalizar_coccion/:id', coccionController.finalizarCoccion);

router.post('/sensores', coccionController.registrarDatosSensor);

// Ruta para obtener registros de temperatura de una cocción específica
router.get('/:id_coccion/registros', coccionController.obtenerRegistrosCoccion);

// Ruta para actualizar el detalle de coccion del modal ingresar cantidad por operador
router.post('/registrarcantidaddetallecoccion/', coccionController.registrarCantidadDetalleCoccion);


module.exports = router;
