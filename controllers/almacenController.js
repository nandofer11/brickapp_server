const almacenController = {
    // Crear un almacén
    register: (req, res) => {
        const { codigoAlmacen, nombreAlmacen } = req.body;

    const sql = `INSERT INTO almacen (codigo_almacen, nombre_almacen) VALUES (?, ?)`
    req.db.query(sql, [codigoAlmacen, nombreAlmacen], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send({ id_almacen: result.insertId, message: "Almacén registrado correctamente" });
    });
    },

    // Obtener todos los alamcenes
    getAll: (req, res) => {
        const sql = "SELECT * from almacen";

    req.db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(results);
    });
    },

    // Actualizar un almacén
    update: (req, res) => {
        const { id } = req.params;
    const { codigoAlmacen, nombreAlmacen } = req.body;

    const sql = `UPDATE almacen SET codigo_almacen = ?, nombre_almacen = ? WHERE id_almacen = ?`;
    req.db.query(sql, [codigoAlmacen, nombreAlmacen, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "Almacén no encontrado" });
        }
        res.send({ message: "Almacén actualizado correctamente" });
    });
    },

    // Eliminar un almacén
    delete: (req, res) => {
        const { id } = req.params;

    const sql = `DELETE FROM almacen WHERE id_almacen = ?`;
    req.db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "Almacén no encontrado" });
        }
        res.send({ message: "Almacén eliminado correctamente" });
    });
    }
};

module.exports = almacenController;
