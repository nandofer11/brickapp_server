const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authenticateToken = require('../middlewares/authenticateToken');

// Ruta para crear un nuevo usuario
router.post('/', usuarioController.createUsuario);

// Ruta para obtener todos los usuarios
router.get('/', authenticateToken, usuarioController.getAllUsuarios);

// Ruta para obtener un usuario por ID
router.get('/:id', authenticateToken, usuarioController.getUsuarioById);

// Ruta para actualizar un usuario
router.put('/:id', authenticateToken, usuarioController.updateUsuario);

// Ruta para eliminar un usuario
router.delete('/:id', authenticateToken, usuarioController.deleteUsuario);

module.exports = router;
