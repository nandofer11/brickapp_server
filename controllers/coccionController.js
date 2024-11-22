const coccionController = {
    register: (req, res) => {
        const { fecha_encendido, horno_id_horno, operadoresCoccion, consumosMateriales } = req.body;

        // Validar datos requeridos
        if (!fecha_encendido || !horno_id_horno) {
            return res.status(400).json({ message: "Datos incompletos o inválidos" });
        }

        // Consulta para insertar la cocción
        const insertCoccionSql = `
        INSERT INTO coccion (fecha_encendido, estado, horno_id_horno, humeada, quema) 
        VALUES (?, 'En curso', ?, 0, 0)
    `;

        req.db.query(insertCoccionSql, [fecha_encendido, horno_id_horno], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Obtener el ID de la cocción recién creada
            const coccionId = result.insertId;

            // Promesas para manejar las consultas asincrónicas
            const queries = [];

            // Insertar operadores en coccion_operador
            if (operadoresCoccion && operadoresCoccion.length > 0) {
                const operadoresValues = operadoresCoccion
                    .map(op => `(${coccionId}, ${op.personal_id_personal}, ${op.cargo_coccion_id_cargo_coccion})`)
                    .join(", ");
                const insertOperadoresSql = `
                INSERT INTO coccion_operador (coccion_id_coccion, personal_id_personal, cargo_coccion_id_cargo_coccion)
                VALUES ${operadoresValues}
            `;
                queries.push(
                    new Promise((resolve, reject) => {
                        req.db.query(insertOperadoresSql, (err) => {
                            if (err) return reject(`Error al insertar operadores: ${err.message}`);
                            resolve();
                        });
                    })
                );
            }

            // Insertar consumos de material en consumo_material
            if (consumosMateriales && consumosMateriales.length > 0) {
                const consumosValues = consumosMateriales
                    .map(consumo => `(${coccionId}, ${consumo.material_id_material}, ${consumo.personal_id_personal || null}, ${consumo.cantidad_consumida || null})`)
                    .join(", ");
                const insertConsumosSql = `
                INSERT INTO consumo_material (coccion_id_coccion, material_id_material, personal_id_personal, cantidad_consumida)
                VALUES ${consumosValues}
            `;
                queries.push(
                    new Promise((resolve, reject) => {
                        req.db.query(insertConsumosSql, (err) => {
                            if (err) return reject(`Error al insertar consumos de material: ${err.message}`);
                            resolve();
                        });
                    })
                );
            }

            // Ejecutar todas las promesas
            Promise.all(queries)
                .then(() => {
                    res.status(201).json({ message: "Cocción registrada con éxito.", coccionId });
                })
                .catch((error) => {
                    res.status(500).json({ error });
                });
        });
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
    h.prefijo,
    h.nombre AS nombre_horno,
    p.nombre_completo AS nombre_operador,
    cc.nombre_cargo
FROM 
    coccion c
INNER JOIN 
    horno h ON c.horno_id_horno = h.id_horno
LEFT JOIN 
    coccion_operador co ON c.id_coccion = co.coccion_id_coccion
LEFT JOIN 
    cargo_coccion cc ON co.cargo_coccion_id_cargo_coccion = cc.id_cargo_coccion
LEFT JOIN 
    personal p ON co.personal_id_personal = p.id_personal
WHERE 
    c.id_coccion = ?
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
