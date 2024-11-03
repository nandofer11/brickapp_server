const bcrypt = require('bcryptjs');

const usuarioController = {
    // Crear un nuevo usuario
    createUsuario: async (req, res) => {
        const { nombre_completo, usuario, contraseña, email, celular, rol_id_rol, empresa_id_empresa } = req.body;
        
        try {
            // Encriptar la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(contraseña, salt);
            
            const SQL = `INSERT INTO usuario (nombre_completo, usuario, contraseña, email, celular, rol_id_rol, empresa_id_empresa) 
                         VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const values = [nombre_completo, usuario, hashedPassword, email, celular, rol_id_rol, empresa_id_empresa];

            // Envolver req.db.query en una Promesa
            const queryPromise = () =>
                new Promise((resolve, reject) => {
                    req.db.query(SQL, values, (err, results) => {
                        if (err) reject(err);
                        else resolve(results);
                    });
                });

            const results = await queryPromise();
            res.status(201).send({ message: 'Usuario creado con éxito', id_usuario: results.insertId });
        } catch (err) {
            res.status(500).send({ error: err.message || 'Error al encriptar la contraseña' });
        }
    },

    // Obtener todos los usuarios
    getAllUsuarios: (req, res) => {
        const SQL = `SELECT u.id_usuario, u.nombre_completo, u.usuario, u.email, u.celular, r.nombre AS rol, e.razon_social AS empresa
                     FROM usuario u
                     JOIN rol r ON u.rol_id_rol = r.id_rol
                     JOIN empresa e ON u.empresa_id_empresa = e.id_empresa`;

        req.db.query(SQL, (err, results) => {
            if (err) return res.status(500).send({ error: err });
            res.send(results);
        });
    },

    // Obtener un usuario por ID
    getUsuarioById: (req, res) => {
        const id = req.params.id;
        const SQL = `SELECT u.id_usuario, u.nombre_completo, u.usuario, u.email, u.celular, r.nombre AS rol, e.razon_social AS empresa
                     FROM usuario u
                     JOIN rol r ON u.rol_id_rol = r.id_rol
                     JOIN empresa e ON u.empresa_id_empresa = e.id_empresa
                     WHERE u.id_usuario = ?`;

        req.db.query(SQL, [id], (err, results) => {
            if (err) return res.status(500).send({ error: err });
            if (results.length > 0) res.send(results[0]);
            else res.status(404).send({ message: 'Usuario no encontrado' });
        });
    },

    // Actualizar un usuario
    updateUsuario: async (req, res) => {
        const id = req.params.id;
        const { nombre_completo, usuario, contraseña, email, celular, rol_id_rol, empresa_id_empresa } = req.body;

        try {
            // Encriptar la contraseña si se proporciona una nueva
            let hashedPassword = contraseña;
            if (contraseña) {
                const salt = await bcrypt.genSalt(10);
                hashedPassword = await bcrypt.hash(contraseña, salt);
            }

            const SQL = `UPDATE usuario SET nombre_completo = ?, usuario = ?, contraseña = ?, email = ?, celular = ?, rol_id_rol = ?, empresa_id_empresa = ?
                         WHERE id_usuario = ?`;
            const values = [nombre_completo, usuario, hashedPassword, email, celular, rol_id_rol, empresa_id_empresa, id];

            req.db.query(SQL, values, (err, results) => {
                if (err) return res.status(500).send({ error: err });
                if (results.affectedRows > 0) res.send({ message: 'Usuario actualizado con éxito' });
                else res.status(404).send({ message: 'Usuario no encontrado o sin cambios' });
            });
        } catch (err) {
            res.status(500).send({ error: 'Error al encriptar la contraseña' });
        }
    },

    // Eliminar un usuario
    deleteUsuario: (req, res) => {
        const id = req.params.id;
        const SQL = `DELETE FROM usuario WHERE id_usuario = ?`;

        req.db.query(SQL, [id], (err, results) => {
            if (err) return res.status(500).send({ error: err });
            if (results.affectedRows > 0) res.send({ message: 'Usuario eliminado con éxito' });
            else res.status(404).send({ message: 'Usuario no encontrado' });
        });
    }
};

module.exports = usuarioController;
