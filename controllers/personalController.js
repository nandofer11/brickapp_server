const Personal = {
    // Función para registrar un trabajador
    register: (req, res) => {
        const { dni, nombre_completo, ciudad, direccion, celular, pago_dia, fecha_ingreso } = req.body;
        const estado = 1; // Establecer el estado por defecto a 1
        const SQL = 'INSERT INTO personal (dni, nombre_completo, ciudad, direccion, celular, pago_dia, fecha_ingreso, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const Values = [dni, nombre_completo, ciudad, direccion, celular, pago_dia, fecha_ingreso, estado];

        req.db.query(SQL, Values, (err, results) => {
            if (err) {
                return res.status(500).send({ error: err });
            }
            res.send({ message: 'Trabajador registrado con éxito', id_personal: results.insertId });
        });
    },

    // Función para listar todos los trabajadores
    list: (req, res) => {
        const SQL = 'SELECT * FROM personal';

        req.db.query(SQL, (err, results) => {
            if (err) {
                return res.status(500).send({ error: err });
            }
            res.send(results);
        });
    },

    // Función para obtener un trabajador por ID
    getById: (req, res) => {
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
    },

    // Función para actualizar un trabajador
    update: (req, res) => {
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
    },

    // Función para eliminar un trabajador
    delete: (req, res) => {
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
    }
};

module.exports = Personal;
