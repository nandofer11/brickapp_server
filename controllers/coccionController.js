const coccionController = {
    // Crear una nueva cocción
    register: async (req, res) => {
        const {
            fecha_encendido,
            hora_inicio,
            fecha_apagado,
            hora_fin,
            humedad_inicial,
            estado,
            horno_id_horno,
            operadoresCoccion,
        } = req.body;

        // Verificar si ya existe una cocción "En curso" para el mismo horno
        req.db.query(
            `SELECT * FROM coccion WHERE horno_id_horno = ? AND estado = 'En curso'`,
            [horno_id_horno],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                // Verificamos si hay una cocción en curso
                if (results && results.length > 0) {
                    return res.status(400).json({
                        message: 'Ya existe una cocción "En curso" para este horno. No se puede registrar una nueva hasta que la cocción actual esté finalizada.'
                    });
                }

                // Construimos el objeto con los datos de la cocción
                const coccionData = {
                    fecha_encendido: fecha_encendido,
                    hora_inicio: hora_inicio,
                    fecha_apagado: fecha_apagado || null,  // Opcional
                    hora_fin: hora_fin || null,            // Opcional
                    humedad_inicial: humedad_inicial || null,
                    estado: estado || 'En curso',         // Asignar estado por defecto si no se especifica
                    horno_id_horno: horno_id_horno,
                };

                const sqlCoccion = `
                    INSERT INTO coccion (fecha_encendido, hora_inicio, fecha_apagado, hora_fin, humedad_inicial, estado, horno_id_horno)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;
                const coccionValues = [
                    coccionData.fecha_encendido,
                    coccionData.hora_inicio,
                    coccionData.fecha_apagado,
                    coccionData.hora_fin,
                    coccionData.humedad_inicial,
                    coccionData.estado,
                    coccionData.horno_id_horno,
                ];

                // Ejecutar la consulta para insertar la cocción
                req.db.query(sqlCoccion, coccionValues, (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    const coccionId = result.insertId; // Obtenemos el ID de la cocción registrada

                    // Ahora registrar los operadores asociados a la cocción en la tabla detalle_coccion
                    if (operadoresCoccion && operadoresCoccion.length > 0) {
                        const sqlOperadorCoccion = `
                            INSERT INTO detalle_coccion 
                            (coccion_id_coccion, cargo_coccion_id_cargo_coccion, material_id_material, cantidad_usada, personal_id_personal)
                            VALUES ?
                        `;
                        const values = operadoresCoccion.map(item => [
                            coccionId, // El ID de la cocción registrada
                            item.cargo_coccion_id_cargo_coccion, // Corrige el acceso al ID del cargo
                            item.material_id_material || null,     // Si no se proporciona, se asigna null
                            item.cantidad_usada || null,           // Si no se proporciona, se asigna null
                            item.personal_id_personal,
                        ]);

                        req.db.query(sqlOperadorCoccion, [values], (err, result) => {
                            if (err) {
                                return res.status(500).json({ error: err.message });
                            }

                            res.status(201).json({ message: 'Cocción y operadores registrados correctamente', coccionId });
                        });
                    } else {
                        // Si no hay operadores asociados, solo registrar la cocción
                        res.status(201).json({ message: 'Cocción registrada sin operadores asociados', coccionId });
                    }
                });
            }
        );
    },

    // Obtener todas las cocciones
    getAll: (req, res) => {
        const sql = `  SELECT coccion.*, horno.nombre AS nombre_horno, horno.prefijo
        FROM coccion
        JOIN horno ON coccion.horno_id_horno = horno.id_horno`;

        req.db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(results);
        });
    },

    // Obtener una cocción por ID
    getById: (req, res) => {
        const { id } = req.params;
        const sql = `SELECT * FROM coccion WHERE id_coccion = ?`;

        req.db.query(sql, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.length === 0) {
                return res.status(404).json({ message: 'Cocción no encontrada' });
            }
            res.status(200).json(result[0]);
        });
    },

    // Actualizar una cocción
    update: (req, res) => {
        const { fecha_apagado, hora_fin, estado, humedad_inicial, horno_id_horno } = req.body;
        const { id } = req.params;
        const sql = `UPDATE coccion SET fecha_apagado = ?, hora_fin = ?, estado = ?, humedad_inicial = ?, horno_id_horno = ? WHERE id_coccion = ?`;

        req.db.query(sql, [fecha_apagado, hora_fin, estado, humedad_inicial, horno_id_horno, id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Cocción actualizada' });
        });
    },

    // Eliminar una cocción
    delete: (req, res) => {
        const { id } = req.params;
        const sql = `DELETE FROM coccion WHERE id_coccion = ?`;

        req.db.query(sql, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Cocción eliminada' });
        });
    },

    // coccionController.js

    // obtener detalle de una coccion por id
    getCoccionDetails: async (req, res) => {
        const coccionId = req.params.id;

        const sql = `
        SELECT 
            c.fecha_encendido,
            c.hora_inicio,
            c.fecha_apagado,
            c.hora_fin,
            c.estado,
            h.nombre AS nombre_horno,
            h.prefijo,
            d.cargo_coccion_id_cargo_coccion,
            cc.nombre_cargo,
            p.nombre_completo AS nombre_operador
        FROM coccion c
        INNER JOIN horno h ON c.horno_id_horno = h.id_horno
        LEFT JOIN detalle_coccion d ON c.id_coccion = d.coccion_id_coccion
        LEFT JOIN cargo_coccion cc ON d.cargo_coccion_id_cargo_coccion = cc.id_cargo_coccion
        LEFT JOIN personal p ON d.personal_id_personal = p.id_personal
        WHERE c.id_coccion = ?
    `;

        req.db.query(sql, [coccionId], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "No se encontraron detalles para esta cocción" });
            }

            // Procesar resultados para estructurarlos en un objeto
            const coccionDetails = {
                fecha_encendido: results[0].fecha_encendido,
                hora_inicio: results[0].hora_inicio,
                fecha_apagado: results[0].fecha_apagado,
                hora_fin: results[0].hora_fin,
                estado: results[0].estado,
                nombre_horno: results[0].nombre_horno,
                prefijo: results[0].prefijo,
                operadores: results.map(row => ({
                    nombre_operador: row.nombre_operador,
                    nombre_cargo: row.nombre_cargo,
                })),
            };

            res.json(coccionDetails);
        });
    },

    // Obtener la coccion H2 en curso
    getCoccionEnCurso: async (req, res) => {
        try {
            // Consulta para verificar cocción en curso con prefijo H2
            const sql = `
            SELECT 
                c.id_coccion,
                c.fecha_encendido,
                c.hora_inicio,
                c.fecha_apagado,
                c.hora_fin,
                c.estado,
                h.nombre AS nombre_horno,
                h.prefijo,
                d.cargo_coccion_id_cargo_coccion,
                cc.nombre_cargo,
                p.nombre_completo AS nombre_operador
            FROM coccion c
            INNER JOIN horno h ON c.horno_id_horno = h.id_horno
            LEFT JOIN detalle_coccion d ON c.id_coccion = d.coccion_id_coccion
            LEFT JOIN cargo_coccion cc ON d.cargo_coccion_id_cargo_coccion = cc.id_cargo_coccion
            LEFT JOIN personal p ON d.personal_id_personal = p.id_personal
            WHERE h.prefijo = 'H2' AND c.estado = 'En curso'
        `;

            req.db.query(sql, (err, results) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                if (results.length === 0) {
                    return res.status(404).json({ message: "No hay cocción registrada en el horno H2" });
                }

                const coccionDetails = {
                    id_coccion: results[0].id_coccion,
                    fecha_encendido: results[0].fecha_encendido,
                    hora_inicio: results[0].hora_inicio,
                    fecha_apagado: results[0].fecha_apagado,
                    hora_fin: results[0].hora_fin,
                    estado: results[0].estado,
                    nombre_horno: results[0].nombre_horno,
                    prefijo: results[0].prefijo,
                    operadores: results.map(row => ({
                        nombre_operador: row.nombre_operador,
                        nombre_cargo: row.nombre_cargo,
                    })),
                };

                res.json(coccionDetails);
            });
        } catch (error) {
            console.error('Error al obtener cocción:', error);
            return res.status(500).json({ message: 'Error en el servidor.' });
        }
    },

    // Función para actualizar los detalles de la cocción
    actualizarDetalleCoccion: async (req, res) => {
        const { id } = req.params; // Obtener el ID de la cocción desde los parámetros de la ruta
        const { materialId, proceso } = req.body; // Obtener los datos del cuerpo de la solicitud

        try {
            // Actualizar la tabla coccion solo con el proceso
            const updateCoccionResult = await db.query(
                'UPDATE coccion SET humeada = $1, quema = $2 WHERE id_coccion = $3',
                [proceso === 'humeada' ? 1 : 0, proceso === 'quema' ? 1 : 0, id]
            );

            // Verificar si se actualizó la cocción
            if (updateCoccionResult.rowCount === 0) {
                return res.status(404).json({ message: 'Cocción no encontrada' });
            }

            // Actualizar el material en la tabla detalle_coccion
            const updateDetalleCoccionResult = await db.query(
                'UPDATE detalle_coccion SET material_id_material = $1 WHERE coccion_id_coccion = $2',
                [materialId, id]
            );

            // Verificar si se actualizó el detalle de cocción
            if (updateDetalleCoccionResult.rowCount === 0) {
                return res.status(404).json({ message: 'Detalle de cocción no encontrado' });
            }

            return res.status(200).json({
                message: 'Cocción y detalle de cocción actualizados con éxito',
                data: {
                    coccion: updateCoccionResult,
                    detalleCoccion: updateDetalleCoccionResult
                }
            });
        } catch (error) {
            console.error('Error al actualizar la cocción:', error);
            return res.status(500).json({ message: 'Error al actualizar la cocción' });
        }
    }
};

module.exports = coccionController;
