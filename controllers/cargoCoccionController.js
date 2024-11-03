const CargoCoccion = {
    // Función para registrar un cargoCoccion
    register: (req, res) => {
        const { nombre_cargo, costo_cargo } = req.body;

        if (!nombre_cargo || !costo_cargo) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const sql = `INSERT INTO cargo_coccion (nombre_cargo, costo_cargo) VALUES (?, ?)`;

        req.db.query(sql, [nombre_cargo, costo_cargo], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Cargo de cocción creado exitosamente', id_cargo_coccion: result.insertId });
        });
    },

    // Función para listar todos los cargoCoccion
    list: (req, res) => {
        const sql = `SELECT * FROM cargo_coccion`;

        req.db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(results);
        });
    },

    // Función para obtener un cargoCoccion por ID
    getById: (req, res) => {
        const { id } = req.params;
        const sql = `SELECT * FROM cargo_coccion WHERE id_cargo_coccion = ?`;

        req.db.query(sql, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.length === 0) {
                return res.status(404).json({ error: 'Cargo de cocción no encontrado' });
            }
            res.status(200).json(result[0]);
        });
    },

    // Función para actualizar un cargoCoccion
    update: (req, res) => {
        const { id } = req.params;
        const { nombre_cargo, costo_cargo } = req.body;

        if (!nombre_cargo || !costo_cargo) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const sql = `UPDATE cargo_coccion SET nombre_cargo = ?, costo_cargo = ? WHERE id_cargo_coccion = ?`;

        req.db.query(sql, [nombre_cargo, costo_cargo, id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cargo de cocción no encontrado' });
            }
            res.status(200).json({ message: 'Cargo de cocción actualizado exitosamente' });
        });
    },

    // Función para eliminar un cargoCoccion
    delete: (req, res) => {
        const { id } = req.params;

        const sql = `DELETE FROM cargo_coccion WHERE id_cargo_coccion = ?`;

        req.db.query(sql, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cargo de cocción no encontrado' });
            }
            res.status(200).json({ message: 'Cargo de cocción eliminado exitosamente' });
        });
    }
};

module.exports = CargoCoccion;
