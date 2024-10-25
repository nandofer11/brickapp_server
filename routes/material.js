const express = require('express');
const router = express.Router();

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
router.get('/', (req, res) => {
    req.db.query("SELECT * FROM material", (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err);
            return res.status(500).json({ error: 'Error en la conexión a la base de datos' });
        }
        res.status(200).json(results);
    });
});


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
router.get('/:id', (req, res) => {
    const sql = "SELECT * FROM material WHERE id_material = ?";
    req.db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Material no encontrado" });
        }
        res.status(200).json(result[0]);
    });
});

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
router.post('/', (req, res) => {
    const { nombreMaterial, presentacion } = req.body;
    if (!nombreMaterial || !presentacion) {
        return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    const sql = "INSERT INTO material (nombre, presentacion) VALUES (?, ?)";
    req.db.query(sql, [nombreMaterial, presentacion], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id_material: result.insertId, message: "Material creado exitosamente" });
    });
});

// Actualizar un material
router.put('/:id', (req, res) => {
    const { nombreMaterial, presentacion } = req.body;
    const sql = "UPDATE material SET nombre = ?, presentacion = ? WHERE id_material = ?";

    req.db.query(sql, [nombreMaterial, presentacion, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Material no encontrado" });
        }
        res.status(200).json({ message: "Material actualizado correctamente" });
    });
});

// Eliminar un material
router.delete('/:id', (req, res) => {
    const sql = "DELETE FROM material WHERE id_material = ?";

    req.db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Material no encontrado" });
        }
        res.status(200).json({ message: "Material eliminado correctamente" });
    });
});

module.exports = router;
