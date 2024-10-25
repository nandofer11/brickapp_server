//Dependencias
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors'); 

// Swagger para la documentación
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const personalRoutes = require('./routes/personal');
const coccionRoutes = require('./routes/coccion');
const hornosRoutes = require('./routes/hornos');
const cargoCoccionRoutes = require('./routes/cargo_coccion');
const almacenesMaterialRoutes = require('./routes/almacenesMaterial');
const materialesRoutes = require('./routes/material');
const comprasMaterialRoutes = require('./routes/comprasmaterial');
const proveedorRoutes = require('./routes/proveedor');
const authRoutes = require('./routes/auth');


app.use(express.json());
app.use(cors());

// Configurar Swagger
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
    apis: ['./routes/*.js'], // Ruta a los archivos con anotaciones de Swagger
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Iniciamos servidor
app.listen(3002, ()=>{
    console.log("Servidor corriendo en el puerto 3002");
})


// Crear conexión a la base de datos
const db = mysql.createConnection({
    user: process.env.DB_USER || 'root',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'bdbrickapp',
    port: process.env.DB_PORT || 3306
});

// Verifica la conexión a MySQL
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
    } else {
        console.log('Conexión a la base de datos exitosa');
    }
});

// Middleware para asignar la conexión a la base de datos en cada request
app.use((req, res, next) => {
    req.db = db;  // Asignar la conexión de la base de datos a `req`
    next();       // Continuar con la siguiente función de middleware o ruta
});


// Rutas 
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/personal', personalRoutes);
app.use('/api/admin/coccion', coccionRoutes);
app.use('/api/admin/hornos', hornosRoutes);
app.use('/api/admin/cargoCoccion', cargoCoccionRoutes);
app.use('/api/admin/almacenesmaterial',  almacenesMaterialRoutes);
app.use('/api/admin/materiales', materialesRoutes);
app.use('/api/admin/comprasmateriales', comprasMaterialRoutes);
app.use('/api/admin/proveedores', proveedorRoutes);
