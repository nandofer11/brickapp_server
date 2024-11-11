// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const db = require('./config/db');  // Importa la conexión a la base de datos
const authenticateToken = require('./middlewares/authenticateToken');

// Inicializar app de Express
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

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
                url: 'http://localhost:3002/api/admin',
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

// Iniciar el servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
