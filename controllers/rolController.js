const rolController = {
    // Crear un nuevo rol
    createRol: (req, res) => {
        const { nombre, descripcion } = req.body;
        const SQL = `INSERT INTO rol (nombre, descripcion) VALUES (?, ?)`;
        const values = [nombre, descripcion];

        req.db.query(SQL, values, (err, results) => {
            if (err) return res.status(500).send({ error: err });
            res.status(201).send({ message: 'Rol creado con éxito', id_rol: results.insertId });
        });
    },

    // Obtener todos los roles
    getAllRoles: (req, res) => {
        const SQL = `SELECT * FROM rol`;

        req.db.query(SQL, (err, results) => {
            if (err) return res.status(500).send({ error: err });
            res.send(results);
        });
    },

    // Obtener un rol por ID
    getRolById: (req, res) => {
        const id = req.params.id;
        const SQL = `SELECT * FROM rol WHERE id_rol = ?`;

        req.db.query(SQL, [id], (err, results) => {
            if (err) return res.status(500).send({ error: err });
            if (results.length > 0) res.send(results[0]);
            else res.status(404).send({ message: 'Rol no encontrado' });
        });
    },

    // Actualizar un rol
    updateRol: (req, res) => {
        const id = req.params.id;
        const { nombre, descripcion } = req.body;
        const SQL = `UPDATE rol SET nombre = ?, descripcion = ? WHERE id_rol = ?`;
        const values = [nombre, descripcion, id];

        req.db.query(SQL, values, (err, results) => {
            if (err) return res.status(500).send({ error: err });
            if (results.affectedRows > 0) res.send({ message: 'Rol actualizado con éxito' });
            else res.status(404).send({ message: 'Rol no encontrado o sin cambios' });
        });
    },

    // Eliminar un rol
    deleteRol: (req, res) => {
        const id = req.params.id;
        const SQL = `DELETE FROM rol WHERE id_rol = ?`;

        req.db.query(SQL, [id], (err, results) => {
            if (err) return res.status(500).send({ error: err });
            if (results.affectedRows > 0) res.send({ message: 'Rol eliminado con éxito' });
            else res.status(404).send({ message: 'Rol no encontrado' });
        });
    }
};

module.exports = rolController;
