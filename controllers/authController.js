const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



exports.loginUser = (req, res) => {
    const { usuario, contraseña } = req.body;

    // Modificación en la consulta SQL para obtener la información completa del rol y la empresa
    const SQL = `
        SELECT u.id_usuario, u.nombre_completo, u.contraseña, 
               r.id_rol, r.nombre AS rol_nombre, r.descripcion AS rol_descripcion,
               e.id_empresa, e.razon_social, e.ruc, e.ciudad, e.direccion, e.telefono, e.email, e.web, e.logo
        FROM usuario u
        JOIN rol r ON u.rol_id_rol = r.id_rol
        JOIN empresa e ON u.empresa_id_empresa = e.id_empresa
        WHERE u.usuario = ?
    `;
    
    req.db.query(SQL, [usuario], async (err, results) => {
        if (err) return res.status(500).send({ error: err });
        if (results.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

        const user = results[0];
        const passwordMatch = await bcrypt.compare(contraseña, user.contraseña);
        if (!passwordMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

        // Crear objeto `userInfo` con los datos completos del rol y la empresa
        const userInfo = {
            id: user.id_usuario,
            nombreCompleto: user.nombre_completo,
            rol: {
                id: user.id_rol,
                nombre: user.rol_nombre,
                descripcion: user.rol_descripcion
            },
            empresa: {
                id: user.id_empresa,
                razonSocial: user.razon_social,
                ruc: user.ruc,
                ciudad: user.ciudad,
                direccion: user.direccion,
                telefono: user.telefono,
                email: user.email,
                web: user.web,
                logo: user.logo
            }
        };

        // Generar token JWT y enviar en la respuesta
        const token = jwt.sign(
            { userId: user.id_usuario, empresaId: user.id_empresa, rolId: user.id_rol },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );
        
        res.json({ message: 'Login exitoso', token, user: userInfo });
    });
};