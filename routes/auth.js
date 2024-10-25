// routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Ruta Login
router.post('/login', (req, res) => {
    const usuarioEnviadoLogin = req.body.usuario;        // Cambiado a "usuario"
    const contraseñaEnviadoLogin = req.body.contraseña;  // Cambiado a "contraseña"
  
    const SQL = 'SELECT * from usuario where usuario = ? && contraseña = ?';
    const Values = [usuarioEnviadoLogin, contraseñaEnviadoLogin];
  
    req.db.query(SQL, Values, (err, results) => {
      if (err) {
        res.send({ error: err });
      } else if (results.length > 0) {
        res.send(results);
      } else {
        res.send({ message: 'Credenciales no coinciden!' });
      }
    });
  });

module.exports = router;
