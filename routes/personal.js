const express = require('express');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Personal:
 *       type: object
 *       required:
 *         - dni
 *         - nombre_completo
 *         - ciudad
 *         - direccion
 *         - celular
 *         - pago_dia
 *         - fecha_ingreso
 *         - estado
 *       properties:
 *         id_personal:
 *           type: integer
 *           description: ID del trabajador
 *         dni:
 *           type: string
 *           description: DNI del trabajador
 *         nombre_completo:
 *           type: string
 *           description: Nombre completo del trabajador
 *         ciudad:
 *           type: string
 *           description: Ciudad del trabajador
 *         direccion:
 *           type: string
 *           description: Dirección del trabajador
 *         celular:
 *           type: string
 *           description: Número de celular del trabajador
 *         pago_dia:
 *           type: number
 *           format: float
 *           description: Pago por día del trabajador
 *         fecha_ingreso:
 *           type: string
 *           format: date
 *           description: Fecha de ingreso del trabajador
 *         estado:
 *           type: string
 *           description: Estado del trabajador
 */

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
router.post('/', (req, res) => {
    console.log(req.db); // Verifica si req.db está definido
    const { dni, nombre_completo, ciudad, direccion, celular, pago_dia, fecha_ingreso, estado } = req.body;
    const SQL = 'INSERT INTO personal (dni, nombre_completo, ciudad, direccion, celular, pago_dia, fecha_ingreso, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const Values = [dni, nombre_completo, ciudad, direccion, celular, pago_dia, fecha_ingreso, estado];

    req.db.query(SQL, Values, (err, results) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        res.send({ message: 'Trabajador registrado con éxito', id_personal: results.insertId });
    });
});

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
router.get('/', (req, res) => {
    const SQL = 'SELECT * FROM personal';

    req.db.query(SQL, (err, results) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        res.send(results);
    });
});

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
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const SQL = 'SELECT * FROM personal WHERE id_personal = ?';
    const Values = [id];

    req.db.query(SQL, Values, (err, results) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        if (results.length > 0) {
            res.send(results[0]);
        } else {
            res.send({ message: 'Trabajador no encontrado' });
        }
    });
});

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
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { dni, nombre_completo, ciudad, direccion, celular, pago_dia, fecha_ingreso, estado } = req.body;
    const SQL = 'UPDATE personal SET dni = ?, nombre_completo = ?, ciudad = ?, direccion = ?, celular = ?, pago_dia = ?, fecha_ingreso = ?, estado = ? WHERE id_personal = ?';
    const Values = [dni, nombre_completo, ciudad, direccion, celular, pago_dia, fecha_ingreso, estado, id];

    req.db.query(SQL, Values, (err, results) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        if (results.affectedRows > 0) {
            res.send({ message: 'Trabajador actualizado con éxito' });
        } else {
            res.send({ message: 'Trabajador no encontrado o no se realizaron cambios' });
        }
    });
});

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
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const SQL = 'DELETE FROM personal WHERE id_personal = ?';
    const Values = [id];

    req.db.query(SQL, Values, (err, results) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        if (results.affectedRows > 0) {
            res.send({ message: 'Trabajador eliminado con éxito' });
        } else {
            res.send({ message: 'Trabajador no encontrado' });
        }
    });
});

// Exportar las rutas
module.exports = router;
