// db.js
const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
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
    } else {
        console.log('Conexión a la base de datos exitosa');
    }
});

module.exports = db;
