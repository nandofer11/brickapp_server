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
                    hora_inicio: hora_inicio || null,
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
        const { hora_inicio, fecha_apagado, hora_fin, estado, humedad_inicial, horno_id_horno, humeada, quema } = req.body;
        const { id } = req.params;
        const sql = `UPDATE coccion SET hora_inicio = ?, fecha_apagado = ?, hora_fin = ?, estado = ?, humedad_inicial = ?, horno_id_horno = ?, humeada = ?, quema = ? WHERE id_coccion = ?`;

        req.db.query(sql, [hora_inicio, fecha_apagado, hora_fin, estado, humedad_inicial, horno_id_horno, humeada, quema, id], (err, result) => {
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
                c.humeada,
                c.quema,
                h.nombre AS nombre_horno,
                h.prefijo,
                d.cargo_coccion_id_cargo_coccion,
                cc.nombre_cargo,
                m.id_material,
                p.id_personal,
                p.nombre_completo AS nombre_operador
            FROM coccion c
            INNER JOIN horno h ON c.horno_id_horno = h.id_horno
            LEFT JOIN detalle_coccion d ON c.id_coccion = d.coccion_id_coccion
            LEFT JOIN material m ON m.id_material = d.material_id_material
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
                    humeada: results[0].humeada,
                    quema: results[0].quema,
                    nombre_horno: results[0].nombre_horno,
                    prefijo: results[0].prefijo,
                    id_material: results[0].id_material,
                    operadores: results.map(row => ({
                        id_personal: row.id_personal,
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

    // Función para atualizar datos de la coccion en curso
    actualizarEstadoCoccion: (req, res) => {
        const { id } = req.params;
        const { campo, valor } = req.body; // `campo` puede ser "humeada" o "quema"
        const hora_inicio = new Date().toISOString().slice(11, 19); // Hora actual (HH:MM:SS)

        // Validar que el campo sea válido
        if (!['humeada', 'quema'].includes(campo)) {
            return res.status(400).json({ error: 'Campo inválido. Solo se permite "humeada" o "quema".' });
        }

        // Construir la consulta SQL dinámicamente
        const sql = `UPDATE coccion SET hora_inicio = ?, ${campo} = ? WHERE id_coccion = ?`;

        req.db.query(sql, [hora_inicio, valor, id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: `El campo ${campo} fue actualizado exitosamente.` });
        });
    },

    // Función para cambiar el proceso de humeada a quema y actualizar la hora_inicio_quema
    cambiarProcesoQuema: (req, res) => {
        const { id } = req.params;
        const hora_inicio_quema = new Date().toISOString().slice(11, 19); // Hora actual (HH:MM:SS)
        const quema = 1;

        const sql = `UPDATE coccion SET hora_inicio_quema = ?, quema = ? WHERE id_coccion = ?`;

        req.db.query(sql, [hora_inicio_quema, quema, id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Proceso de quema iniciado exitosamente' });
        });
    },

    // Función para finalizar la cocción y actualizar las columnas de fecha_apagado, hora_fin y estado
    finalizarCoccion: (req, res) => {
        const { id } = req.params;
        const fecha_apagado = new Date().toISOString().slice(0, 10); // Fecha actual (YYYY-MM-DD)
        const hora_fin = new Date().toISOString().slice(11, 19); // Hora actual (HH:MM:SS)
        const estado = 'Finalizado';

        const sql = `UPDATE coccion SET fecha_apagado = ?, hora_fin = ?, estado = ? WHERE id_coccion = ?`;

        req.db.query(sql, [fecha_apagado, hora_fin, estado, id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Cocción finalizada exitosamente' });
        });
    },

    // Registrar datos de los sensores
    registrarDatosSensor: async (req, res) => {
        try {
            const { temperaturaDHT, humedad, temperaturaTermocupla } = req.body;

            console.log("Datos recibidos:", { temperaturaDHT, humedad, temperaturaTermocupla });

            // Validar datos
            if (!temperaturaDHT || !humedad || !temperaturaTermocupla) {
                return res.status(400).json({ error: "Todos los datos son requeridos" });
            }

            const fecha = new Date().toISOString().split("T")[0];
            const hora = new Date().toISOString().split("T")[1].split(".")[0];

            console.log("Fecha y hora:", { fecha, hora });

            // Obtener el ID de cocción en curso para el horno con prefijo 'H2'
            const queryCoccion = `
                SELECT c.id_coccion 
                FROM coccion c
                JOIN horno h ON c.horno_id_horno = h.id_horno
                WHERE c.estado = 'En curso' AND h.prefijo = 'H2'
                LIMIT 1;
            `;

            req.db.query(queryCoccion, (err, coccionResult) => {
                if (err) {
                    console.error("Error obteniendo id_coccion:", err);
                    return res.status(500).json({ error: "Error al consultar la cocción en curso" });
                }

                console.log("Resultado de cocción:", coccionResult);

                const coccion = coccionResult[0];
                if (!coccion) {
                    console.warn("No se encontró una cocción en curso para el horno H2");
                    return res.status(404).json({ error: "No hay cocción en curso para el horno H2" });
                }

                const idCoccion = coccion.id_coccion;

                console.log("ID de cocción recuperado:", idCoccion);

                // Obtener ID del sensor Termocupla
                req.db.query("SELECT id_sensor_temperatura FROM sensor WHERE nombre = 'Termocupla 1'", (err, sensorTermocuplaResult) => {
                    if (err) {
                        console.error("Error obteniendo sensor Termocupla:", err);
                        return res.status(500).json({ error: "Error al consultar el sensor Termocupla" });
                    }

                    console.log("Resultado del sensor Termocupla:", sensorTermocuplaResult);

                    const sensorTermocupla = sensorTermocuplaResult[0];
                    if (!sensorTermocupla) {
                        console.warn("Sensor 'Termocupla 1' no encontrado");
                        return res.status(404).json({ error: "Sensor 'Termocupla 1' no encontrado" });
                    }

                    // Obtener ID del sensor DHT
                    req.db.query("SELECT id_sensor_temperatura FROM sensor WHERE nombre = 'DHT22'", (err, sensorDHTResult) => {
                        if (err) {
                            console.error("Error obteniendo sensor DHT:", err);
                            return res.status(500).json({ error: "Error al consultar el sensor DHT" });
                        }

                        console.log("Resultado del sensor DHT22:", sensorDHTResult);

                        const sensorDHT = sensorDHTResult[0];
                        if (!sensorDHT) {
                            console.warn("Sensor 'DHT22' no encontrado");
                            return res.status(404).json({ error: "Sensor 'DHT22' no encontrado" });
                        }

                        console.log("ID de sensores recuperados:", {
                            DHT: sensorDHT.id_sensor_temperatura,
                            Termocupla: sensorTermocupla.id_sensor_temperatura,
                        });

                        // Registrar datos para DHT22
                        req.db.query(
                            "INSERT INTO registro_sensor (fecha, hora, temperatura, coccion_id_coccion, sensor_id_sensor) VALUES (?, ?, ?, ?, ?)",
                            [fecha, hora, temperaturaDHT, idCoccion, sensorDHT.id_sensor_temperatura],
                            (err) => {
                                if (err) {
                                    console.error("Error registrando datos de DHT22:", err);
                                    return res.status(500).json({ error: "Error al registrar datos de DHT22" });
                                }

                                console.log("Datos de DHT22 registrados correctamente");

                                // Registrar datos para Termocupla
                                req.db.query(
                                    "INSERT INTO registro_sensor (fecha, hora, temperatura, coccion_id_coccion, sensor_id_sensor) VALUES (?, ?, ?, ?, ?)",
                                    [fecha, hora, temperaturaTermocupla, idCoccion, sensorTermocupla.id_sensor_temperatura],
                                    (err) => {
                                        if (err) {
                                            console.error("Error registrando datos de Termocupla:", err);
                                            return res.status(500).json({ error: "Error al registrar datos de Termocupla" });
                                        }

                                        console.log("Datos de Termocupla registrados correctamente");
                                        res.status(201).json({ message: "Datos registrados correctamente" });
                                    }
                                );
                            }
                        );
                    });
                });
            });
        } catch (error) {
            console.error("Error en registrarDatosSensor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // Obtener registros de temperatura para una cocción específica
    obtenerRegistrosCoccion: (req, res) => {
        const { id_coccion } = req.params;

        const sql = `
            SELECT hora, temperatura
            FROM registro_sensor
            WHERE coccion_id_coccion = ? AND sensor_id_sensor = 1
            ORDER BY fecha, hora
        `;

        req.db.query(sql, [id_coccion], (err, rows) => {
            if (err) {
                console.error('Error al obtener los registros:', err);
                return res.status(500).json({ message: 'Error al obtener los registros' });
            }

            if (rows.length === 0) {
                return res.status(404).json({ message: 'No se encontraron registros para esta cocción' });
            }

            res.status(200).json(rows);
        });
    },

    // Registrar cantidad en detalle_coccion
    registrarCantidadDetalleCoccion: async (req, res) => {
        const {
            coccion_id_coccion,
            cargo_coccion_id_cargo_coccion,
            material_id_material,
            personal_id_personal,
            cantidad_usada
        } = req.body;

        console.log(req.body);

        // Validar que todos los campos requeridos estén presentes
        if (!coccion_id_coccion || !cargo_coccion_id_cargo_coccion || !material_id_material || !personal_id_personal || cantidad_usada == null) {
            return res.status(400).json({
                message: 'Datos incompletos: Todos los campos son requeridos (coccion_id_coccion, cargo_coccion_id_cargo_coccion, material_id_material, personal_id_personal, cantidad_usada)',
            });
        }

        try {
            // Insertar un nuevo detalle en la tabla
            const query = `
                INSERT INTO detalle_coccion (
                    coccion_id_coccion,
                    cargo_coccion_id_cargo_coccion,
                    material_id_material,
                    personal_id_personal,
                    cantidad_usada,
                    timestamp
                ) VALUES (?, ?, ?, ?, ?, NOW());
            `;
            

            req.db.query(
                query,
                [
                    coccion_id_coccion,
                    cargo_coccion_id_cargo_coccion,
                    material_id_material,
                    personal_id_personal,
                    cantidad_usada,
                ],
                (err, result) => {
                    if (err) {
                        console.error('Error al ejecutar la consulta:', err);
                        return res.status(500).json({ message: 'Error interno del servidor' });
                    }

                    res.status(201).json({
                        message: 'Detalle de cocción registrado con éxito',
                        data: {
                            id_detalle_coccion: result.insertId,
                            coccion_id_coccion,
                            cargo_coccion_id_cargo_coccion,
                            material_id_material,
                            personal_id_personal,
                            cantidad_usada,
                        },
                    });
                }
            );
        } catch (error) {
            console.error('Error en el controlador:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
};

module.exports = coccionController;
