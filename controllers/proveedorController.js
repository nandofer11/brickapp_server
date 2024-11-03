const proveedorController = {
    // Crear un proveedor
    register: (req, res) => {
        const { tipo_documento, nro_documento, nombre, ciudad, telefono, celular, email } = req.body;

        const query = `
          INSERT INTO proveedor (tipo_documento, nro_documento, nombre, ciudad, telefono, celular, email)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [tipo_documento, nro_documento, nombre, ciudad, telefono, celular, email];

        req.db.query(query, values, (err, result) => {
            if (err) {
                return res.status(500).send({ error: 'Error al crear el proveedor.' });
            }
            res.status(201).send({ message: 'Proveedor creado con éxito.', id: result.insertId });
        });
    },

    // Obtener todos los proveedores
    getAll: (req, res) => {
        const query = `SELECT * FROM proveedor`;

        req.db.query(query, (err, results) => {
            if (err) {
                return res.status(500).send({ error: 'Error al obtener los proveedores.' });
            }
            res.json(results);
        });
    },

    getById: (req, res) => {
        const query = `SELECT * FROM proveedor WHERE id_proveedor = ?`;

        req.db.query(query, [req.params.id], (err, result) => {
            if (err) {
                return res.status(500).send({ error: 'Error al obtener el proveedor.' });
            }
            if (result.length === 0) {
                return res.status(404).send({ error: 'Proveedor no encontrado.' });
            }
            res.json(result[0]);
        });
    },

    // Actualizar un proveedor
    update: (req, res) => {
        const { tipo_documento, nro_documento, nombre, ciudad, telefono, celular, email } = req.body;

        const query = `
          UPDATE proveedor
          SET tipo_documento = ?, nro_documento = ?, nombre = ?, ciudad = ?, telefono = ?, celular = ?, email = ?
          WHERE id_proveedor = ?
        `;
        const values = [tipo_documento, nro_documento, nombre, ciudad, telefono, celular, email, req.params.id];

        req.db.query(query, values, (err, result) => {
            if (err) {
                return res.status(500).send({ error: 'Error al actualizar el proveedor.' });
            }
            res.send({ message: 'Proveedor actualizado con éxito.' });
        });
    },

    // Eliminar un proveedor
    delete: (req, res) => {
        const query = `
        DELETE FROM proveedor
        WHERE id_proveedor = ?
      `;

        req.db.query(query, [req.params.id], (err, result) => {
            if (err) {
                return res.status(500).send({ error: 'Error al eliminar el proveedor.' });
            }
            res.send({ message: 'Proveedor eliminado con éxito.' });
        });
    }
};

module.exports = proveedorController;
