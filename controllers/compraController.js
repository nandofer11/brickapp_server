const compraController = {
    // Crear una compra
    register: (req, res) => {
        const { fecha_compra, estado_pago } = req.body;

        const query = `
          INSERT INTO compra (fecha_compra, estado_pago)
          VALUES (?, ?)
        `;
        const values = [fecha_compra, estado_pago];

        req.db.query(query, values, (err, result) => {
            if (err) {
                return res.status(500).send({ error: 'Error al crear la compra de material.' });
            }
            res.status(201).send({ message: 'Compra de material creada con éxito.', id: result.insertId });
        });
    },

    // Obtener todas las compras
    getAll: (req, res) => {
        const query = `SELECT * FROM compra`;

        req.db.query(query, (err, results) => {
            if (err) {
                return res.status(500).send({ error: 'Error al obtener las compras de material.' });
            }
            res.json(results);
        });
    },

    // Obtener ua compra por ID
    getById: (req, res) => {
        const query = `SELECT * FROM compra WHERE id_compra = ?`;

        req.db.query(query, [req.params.id], (err, result) => {
            if (err) {
                return res.status(500).send({ error: 'Error al obtener la compra de material.' });
            }
            if (result.length === 0) {
                return res.status(404).send({ error: 'Compra de material no encontrada.' });
            }
            res.json(result[0]);
        });
    },

    // Actualizar una compra
    update: (req, res) => {
        const { fecha_compra, estado_pago } = req.body;

        const query = `
          UPDATE compra
          SET fecha_compra = ?, estado_pago = ?
          WHERE id_compra = ?
        `;
        const values = [fecha_compra, estado_pago, req.params.id];

        req.db.query(query, values, (err, result) => {
            if (err) {
                return res.status(500).send({ error: 'Error al actualizar la compra de material.' });
            }
            res.send({ message: 'Compra de material actualizada con éxito.' });
        });
    },

    // Eliminar una compra
    delete: (req, res) => {
        const query = `
    DELETE FROM compra
    WHERE id_compra = ?
  `;

        req.db.query(query, [req.params.id], (err, result) => {
            if (err) {
                return res.status(500).send({ error: 'Error al eliminar la compra de material.' });
            }
            res.send({ message: 'Compra de material eliminada con éxito.' });
        });
    }
};

module.exports = compraController;
