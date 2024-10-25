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


// Crear un pool en vez de una única conexión
const db = mysql.createPool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 10 // Ajusta el límite de conexiones
});

// Verifica la conexión al iniciar la aplicación
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conexión a la base de datos exitosa');
        connection.release(); // Libera la conexión después de probar
    }
});

// Middleware para asignar la conexión a la base de datos en cada request
app.use((req, res, next) => {
    req.db = db;  // Asignar la conexión de la base de datos a `req`
    next();       // Continuar con la siguiente función de middleware o ruta
});

// Ruta Login
app.post('/api/login', (req, res)=>{
    // Obtener valores enviadas desde el frontend
    const usuarioEnviadoLogin = req.body.LoginUsuario;
    const contraseñaEnviadoLogin = req.body.LoginContraseña;

    // Crear sentencia sql para login en la tabla usuarios de la bd
    const SQL = 'SELECT * from usuario where usuario = ? && contraseña = ?';
    const Values = [usuarioEnviadoLogin, contraseñaEnviadoLogin];

    // Ejecuta la sentencia SQL
    db.query(SQL, Values, (err, results)=>{
        if(err){
            res.send({error: err});
        }
        if(results.length > 0){
            res.send(results)
        }
        else{
            res.send({message: `Credenciales no coinciden!`})
        }
    })
})

// Rutas 
app.use('/api/admin/personal', personalRoutes);
app.use('/api/admin/coccion', coccionRoutes);
app.use('/api/admin/hornos', hornosRoutes);
app.use('/api/admin/cargoCoccion', cargoCoccionRoutes);
app.use('/api/admin/almacenesmaterial',  almacenesMaterialRoutes);
app.use('/api/admin/materiales', materialesRoutes);
app.use('/api/admin/comprasmateriales', comprasMaterialRoutes);
app.use('/api/admin/proveedores', proveedorRoutes);
