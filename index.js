// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const db = require('./config/db');  // Importa la conexión a la base de datos
const authenticateToken = require('./middlewares/authenticateToken');

const jwt = require('jsonwebtoken');

// Inicializar app de Express
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
    origin: '*',  // Permitir todas las conexiones o especificar las IPs permitidas
}));

// Conectar la base de datos en cada solicitud
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Brickapp',
            version: '1.0.0',
            description: 'API para la gestión del proceso de cocción en la aplicación',
        },
        servers: [
            {
                url: 'http://192.168.122.234:3002/api/admin',
                description: 'Servidor de desarrollo'
            }
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas de autenticación
const authRoutes = require('./routes/authRoutes');
app.use('/api/admin/auth', authRoutes);

//Ruta para registro de empresa
const empresaRoutes = require('./routes/empresaRoutes');
app.use('/api/admin/empresa', empresaRoutes);

// Rutas protegidas (requieren autenticación)
const usuariosRoutes = require('./routes/usuarioRoutes');
const hornosRoutes = require('./routes/hornosRoutes');
const rolRoutes = require('./routes/rolRoutes');
const personalRoutes = require('./routes/personalRoutes');
const coccionRoutes = require('./routes/coccionRoutes');
const cargoCoccionRoutes = require('./routes/cargoCoccionRoutes');
const almacenRoutes = require('./routes/almacenRoutes');
const materialRoutes = require('./routes/materialRoutes');
const compraRoutes = require('./routes/compraRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');

// Agrupar rutas protegidas usando middleware de autenticación
app.use('/api/admin/rol', rolRoutes);
app.use('/api/admin/usuario', usuariosRoutes);
app.use('/api/admin/personal', authenticateToken, personalRoutes);
app.use('/api/admin/coccion', authenticateToken, coccionRoutes);
app.use('/api/admin/horno', authenticateToken, hornosRoutes);
app.use('/api/admin/cargococcion', authenticateToken, cargoCoccionRoutes);
app.use('/api/admin/almacen', authenticateToken, almacenRoutes);
app.use('/api/admin/material', authenticateToken, materialRoutes);
app.use('/api/admin/comprasmateriales', authenticateToken, compraRoutes);
app.use('/api/admin/proveedores', authenticateToken, proveedorRoutes);

// ruta para generar token temporal para el ESP32
app.post('/api/token-esp32', (req, res) => {
    try {
        const espToken = jwt.sign(
            { device: 'ESP32' }, // Datos del token
            process.env.JWT_SECRET, // Clave secreta
            { expiresIn: '96h' } // Duración: 96 horas (4 días)
        );
        res.status(200).json({ token: espToken });
    } catch (error) {
        console.error("Error generando token para ESP32:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
