// routes/empresaRoutes.js

const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');

// Ruta para crear una nueva empresa
router.post('/', empresaController.createEmpresa);

// Ruta para obtener todas las empresas
router.get('/', empresaController.getAllEmpresas);

// Ruta para obtener una empresa por ID
router.get('/:id', empresaController.getEmpresaById);

// Ruta para actualizar una empresa
router.put('/:id', empresaController.updateEmpresa);

// Ruta para eliminar una empresa
router.delete('/:id', empresaController.deleteEmpresa);

module.exports = router;
