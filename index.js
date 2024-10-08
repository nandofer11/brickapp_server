//Dependencias
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors'); 

const personalRoutes = require('./routes/personal');
const coccionRoutes = require('./routes/coccion');
const hornosRoutes = require('./routes/hornos');
const cargoCoccionRoutes = require('./routes/cargo_coccion');

app.use(express.json());
app.use(cors());

//Iniciamos servidor
app.listen(3002, ()=>{
    console.log("Servidor corriendo en el puerto 3002");
})

// Crear bd
const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'password',
    database: 'bdbrickapp',
    port: 8080
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