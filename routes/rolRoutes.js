const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');
const authenticateToken = require('../middlewares/authenticateToken');

// Ruta para crear un nuevo rol
router.post('/', rolController.createRol);

// Ruta para obtener todos los roles
router.get('/', authenticateToken, rolController.getAllRoles);

// Ruta para obtener un rol por ID
router.get('/:id', authenticateToken, rolController.getRolById);

// Ruta para actualizar un rol
router.put('/:id', authenticateToken, rolController.updateRol);

// Ruta para eliminar un rol
router.delete('/:id', authenticateToken, rolController.deleteRol);

module.exports = router;
