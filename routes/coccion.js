const express = require('express');
const router = express.Router()// Tu archivo de configuración de base de datos
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
router.post('/', (req, res) => {
    const {
        fecha_encendido,
        hora_inicio,
        fecha_apagado,
        hora_fin,
        humedad_inicial,
        estado,
        horno_id_horno,
        usuario_id_usuario,
        operadoresCoccion,
    } = req.body;

    // Construimos el objeto con los datos de la cocción
    const coccionData = {
        fecha_encendido: fecha_encendido,
        hora_inicio: hora_inicio,
        fecha_apagado: fecha_apagado || null,  // Opcional
        hora_fin: hora_fin || null,            // Opcional
        humedad_inicial: humedad_inicial || null,
        estado: estado || 'En curso',         // Asignar estado por defecto si no se especifica
        horno_id_horno: horno_id_horno,
        usuario_id_usuario: usuario_id_usuario || null,
    };
    // console.log(coccionData);

    // Suponiendo que tienes la conexión a la base de datos en req.db
    const sqlCoccion = `
        INSERT INTO coccion (fecha_encendido, hora_inicio, fecha_apagado, hora_fin, humedad_inicial, estado, horno_id_horno, usuario_id_usuario)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const coccionValues = [
        coccionData.fecha_encendido,
        coccionData.hora_inicio,
        coccionData.fecha_apagado,
        coccionData.hora_fin,
        coccionData.humedad_inicial,
        coccionData.estado,
        coccionData.horno_id_horno,
        coccionData.usuario_id_usuario,
    ];

    // Ejecutar la consulta para insertar la cocción
    req.db.query(sqlCoccion, coccionValues, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const coccionId = result.insertId; // Obtenemos el ID de la cocción registrada

        // Ahora registrar los operadores asociados a la cocción en la tabla operador_coccion
        if (operadoresCoccion && operadoresCoccion.length > 0) {
            const sqlOperadorCoccion = `
                INSERT INTO operador_coccion 
                (coccion_id_coccion, cargo_coccion_id_cargo_coccion, abastecedor_id_abastecedor, material_id_material, cantidad_usada, personal_id_personal)
                VALUES ?`;

            const values = operadoresCoccion.map(item => [
                coccionId, // El ID de la cocción registrada
                item.cargo_coccion_id_cargo_coccion, // Corrige el acceso al ID del cargo
                item.abastecedor_id_abastecedor || null, // Si no se proporciona, se asigna null
                item.material_id_material || null,     // Si no se proporciona, se asigna null
                item.cantidad_usada || null,  // Si no se proporciona, se asigna null
                item.personal_id_personal,
            ]);

            req.db.query(sqlOperadorCoccion, [values], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.status(201).json({ message: 'Cocción y operadores registrados correctamente', coccionId });
            });
        } else {
            // Si no hay operadores asociados, solo registrar la cocción
            res.status(201).json({ message: 'Cocción registrada sin operadores asociados', coccionId });
        }
    });
});


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
router.put('/:id', (req, res) => {
    const { fecha_apagado, hora_fin, estado, humedad_inicial, horno_id_horno, usuario_id_usuario } = req.body;
    const { id } = req.params;
    const sql = `UPDATE coccion SET fecha_apagado = ?, hora_fin = ?, estado = ?, humedad_inicial = ?, horno_id_horno = ?, usuario_id_usuario = ? WHERE id_coccion = ?`;

    req.db.query(sql, [fecha_apagado, hora_fin, estado, humedad_inicial, horno_id_horno, usuario_id_usuario, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Cocción actualizada' });
    });
});

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
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM coccion WHERE id_coccion = ?`;

    req.db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Cocción eliminada' });
    });
});


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
router.get('/', (req, res) => {
    const sql = `  SELECT coccion.*, horno.nombre AS nombre_horno, horno.prefijo
        FROM coccion
        JOIN horno ON coccion.horno_id_horno = horno.id_horno`;

    req.db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

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
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM coccion WHERE id_coccion = ?`;

    req.db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Cocción no encontrada' });
        }
        res.status(200).json(result[0]);
    });
});

module.exports = router;
