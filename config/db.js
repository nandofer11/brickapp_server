const mysql = require('mysql');
require('dotenv').config();

let db;

function connectDatabase() {
    db = mysql.createConnection({
        user: process.env.DB_USER || 'root',
        host: process.env.DB_HOST || 'localhost',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'bdbrickapp',
        port: process.env.DB_PORT || 3306,
        connectTimeout: 10000,
    });

    db.connect((err) => {
        if (err) {
            console.error('Error conectando a la base de datos:', err);
            setTimeout(connectDatabase, 5000); // Intenta reconectar después de 5 segundos
        } else {
            console.log('Conexión a la base de datos exitosa');
        }
    });

    db.on('error', (err) => {
        console.error('Error en la conexión de la base de datos:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connectDatabase(); // Reconecta en caso de pérdida de conexión
        } else {
            throw err;
        }
    });
}

connectDatabase();

module.exports = db;

