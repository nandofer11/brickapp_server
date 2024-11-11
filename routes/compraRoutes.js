const express = require('express');
const compraController = require('../controllers/compraController');
const router = express.Router();


// Obtener todas las compras de material
router.get('/', compraController.getAll);

// Obtener una compra de material por ID
router.get('/:id', compraController.getById);

// Crear una nueva compra de material
router.post('/', compraController.register);

// Actualizar una compra de material por ID
router.put('/:id', compraController.update);

// Eliminar una compra de material por ID
router.delete('/:id', compraController.delete);

module.exports = router;
