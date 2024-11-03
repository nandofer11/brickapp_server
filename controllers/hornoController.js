const Horno = {
    // Función para registrar un horno
    register: (req, res) => {
        const { prefijo, nombre, cantidad_operadores } = req.body;

        if (!prefijo || !nombre || !cantidad_operadores) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const sql = `INSERT INTO horno (prefijo, nombre, cantidad_operadores) VALUES (?, ?, ?)`;

        req.db.query(sql, [prefijo, nombre, cantidad_operadores], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Horno registrado exitosamente', id_horno: result.insertId });
        });
    },

    // Función para listar todos los hornos
    list: (req, res) => {
        const sql = `SELECT * FROM horno`;

        req.db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(results);
        });
    },

    // Función para obtener un horno por ID
    getById: (req, res) => {
        const { id } = req.params;
        const sql = `SELECT * FROM horno WHERE id_horno = ?`;

        req.db.query(sql, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.length === 0) {
                return res.status(404).json({ error: 'Horno no encontrado' });
            }
            res.status(200).json(result[0]);
        });
    },

    // Función para actualizar un horno
    update: (req, res) => {
        const { id } = req.params;
        const { prefijo, nombre, cantidad_operadores } = req.body;

        if (!prefijo || !nombre || !cantidad_operadores) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const sql = `UPDATE horno SET prefijo = ?, nombre = ?, cantidad_operadores = ? WHERE id_horno = ?`;

        req.db.query(sql, [prefijo, nombre, cantidad_operadores, id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Horno no encontrado' });
            }
            res.status(200).json({ message: 'Horno actualizado exitosamente' });
        });
    },

    // Función para eliminar un horno
    delete: (req, res) => {
        const { id } = req.params;

        const sql = `DELETE FROM horno WHERE id_horno = ?`;

        req.db.query(sql, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Horno no encontrado' });
            }
            res.status(200).json({ message: 'Horno eliminado exitosamente' });
        });
    }
};

module.exports = Horno;
