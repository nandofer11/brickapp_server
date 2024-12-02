const compraController = {
    // Crear una compra
    register: async (req, res) => {
        const {
            fecha_compra,
            estado_pago,
            destino_quema,
            almacen_id_almacen,
            proveedor_id_proveedor,
            detalles // Este debe ser un array de objetos con cantidad, precio_unitario_compra, id_material
        } = req.body;

        try {
            // 1. Insertar en la tabla compra
            const insertCompraQuery = `
            INSERT INTO compra (fecha_compra, estado_pago, destino_quema, almacen_id_almacen, proveedor_id_proveedor)
            VALUES (?, ?, ?, ?, ?)
        `;
            const compraValues = [fecha_compra, estado_pago, destino_quema, almacen_id_almacen, proveedor_id_proveedor];

            // Ejecutar la inserción en la tabla compra
            const { insertId: idCompra } = await new Promise((resolve, reject) => {
                req.db.query(insertCompraQuery, compraValues, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });

            // 2. Insertar en la tabla compra_detalle
            if (detalles && detalles.length > 0) {
                const insertDetalleQuery = `
                INSERT INTO compra_detalle (cantidad, precio_unitario_compra, id_compra, id_material)
                VALUES ?
            `;
                const detalleValues = detalles.map(detalle => [
                    detalle.cantidad,
                    detalle.precio_unitario_compra,
                    idCompra, // Usar el ID de la compra recién insertada
                    detalle.id_material
                ]);

                await new Promise((resolve, reject) => {
                    req.db.query(insertDetalleQuery, [detalleValues], (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            }

            // Responder éxito
            res.status(201).json({ message: 'Compra registrada con éxito', idCompra });
        } catch (error) {
            // Manejar errores
            res.status(500).json({ error: error.message });
        }
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
    },

    obtenerCompraDetalles: (req, res) => {
        try {
            const query = `
            SELECT 
                c.id_compra AS 'ID Compra',
                c.fecha_compra AS 'Fecha Compra',
                c.estado_pago AS 'Estado Pago',
                CASE 
                    WHEN c.destino_quema = 1 THEN 'Quema'
                    WHEN c.destino_quema = 0 THEN 'Almacén'
                    ELSE 'Indefinido'
                END AS 'Destino',
                a.nombre_almacen AS 'Nombre Almacén',
                p.nombre AS 'Proveedor',
                p.tipo_documento AS 'Tipo Documento',
                p.nro_documento AS 'Nro Documento',
                cd.cantidad AS 'Cantidad',
                cd.precio_unitario_compra AS 'Precio Unitario',
                (cd.cantidad * cd.precio_unitario_compra) AS 'Subtotal',
                m.nombre AS 'Material',
                m.presentacion AS 'Presentación Material'
            FROM 
                compra c
            LEFT JOIN 
                almacen a ON c.almacen_id_almacen = a.id_almacen
            INNER JOIN 
                proveedor p ON c.proveedor_id_proveedor = p.id_proveedor
            INNER JOIN 
                compra_detalle cd ON c.id_compra = cd.id_compra
            INNER JOIN 
                material m ON cd.id_material = m.id_material
            ORDER BY 
                c.fecha_compra DESC, c.id_compra;
        `;

            req.db.query(query, (err, results) => {
                if (err) {
                    console.error('Error al obtener detalles de compras:', err);
                    return res.status(500).json({ error: 'Error interno del servidor.' });
                }

                return res.status(200).json(results);
            });
        } catch (error) {
            console.error('Error inesperado:', error);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
};

module.exports = compraController;
