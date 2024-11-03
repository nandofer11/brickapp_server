const materialController = {
    // Crear un material
    register: (req, res) => {
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
    },

    // Obtener todos los materiales
    getAll: (req, res) => {
        req.db.query("SELECT * FROM material", (err, results) => {
            if (err) {
                console.error("Error en la consulta:", err);
                return res.status(500).json({ error: 'Error en la conexión a la base de datos' });
            }
            res.status(200).json(results);
        });
    },

    getById: (req, res) => {
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
    },

    // Actualizar un material
    update: (req, res) => {
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
    },

    // Eliminar un material
    delete: (req, res) => {
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
    }
};

module.exports = materialController;
