const coccionController = {
    // Crear una nueva cocción
    register: (req, res) => {
        const {
            fecha_encendido,
            hora_inicio,
            fecha_apagado,
            hora_fin,
            humedad_inicial,
            estado,
            horno_id_horno,
            // usuario_id_usuario,
            operadoresCoccion,
        } = req.body;

        // Construimos el objeto con los datos de la cocción
        const coccionData = {
            fecha_encendido: fecha_encendido,
            hora_inicio: hora_inicio,
            fecha_apagado: fecha_apagado || null,  // Opcional
            hora_fin: hora_fin || null,            // Opcional
            humedad_inicial: humedad_inicial || null,
            estado: estado || 'En curso',         // Asignar estado por defecto si no se especifica
            horno_id_horno: horno_id_horno,
            // usuario_id_usuario: usuario_id_usuario || null,
        };
        // console.log(coccionData);

        // Suponiendo que tienes la conexión a la base de datos en req.db
        const sqlCoccion = `
            INSERT INTO coccion (fecha_encendido, hora_inicio, fecha_apagado, hora_fin, humedad_inicial, estado, horno_id_horno)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

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

            // Ahora registrar los operadores asociados a la cocción en la tabla operador_coccion
            if (operadoresCoccion && operadoresCoccion.length > 0) {
                const sqlOperadorCoccion = `
                    INSERT INTO detalle_coccion 
                    (coccion_id_coccion, cargo_coccion_id_cargo_coccion, material_id_material, cantidad_usada, personal_id_personal)
                    VALUES ?`;

                const values = operadoresCoccion.map(item => [
                    coccionId, // El ID de la cocción registrada
                    item.cargo_coccion_id_cargo_coccion, // Corrige el acceso al ID del cargo
                    item.material_id_material || null,     // Si no se proporciona, se asigna null
                    item.cantidad_usada || null,  // Si no se proporciona, se asigna null
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
    }
};

module.exports = coccionController;
