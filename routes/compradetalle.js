const express = require('express');
const router = express.Router();
const compraDetalleController = require('../controllers/compraDetalleController');

// Obtener todos los detalles de compras de material
router.get('/', compraDetalleController.getAll);

// Obtener un detalle de compra de material por ID
router.get('/:id', compraDetalleController.getById);

// Crear un nuevo detalle de compra de material
router.post('/', compraDetalleController.register);

// Actualizar un detalle de compra de material por ID
router.put('/:id', compraDetalleController.update);

// Eliminar un detalle de compra de material por ID
router.delete('/:id', compraDetalleController.delete);

module.exports = router;
