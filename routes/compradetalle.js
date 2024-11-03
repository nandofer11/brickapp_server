const express = require('express');
const router = express.Router();

// Obtener todos los detalles de compras de material
router.get('/', (req, res) => {
  const query = `
    SELECT pdc.*, p.nombre AS proveedor, m.nombre AS material, cm.fecha_compra
    FROM compra_detalle pdc
    INNER JOIN proveedor p ON pdc.id_proveedor = p.id_proveedor
    INNER JOIN material m ON pdc.id_material = m.id_material
    INNER JOIN compra cm ON pdc.id_compra = cm.id_compra
  `;

  req.db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send({ error: 'Error al obtener los detalles de compras de material.' });
    }
    res.json(results);
  });
});

// Obtener un detalle de compra de material por ID
router.get('/:id', (req, res) => {
  const query = `
    SELECT pdc.*, p.nombre AS proveedor, m.nombre AS material, cm.fecha_compra
    FROM compra_detalle pdc
    INNER JOIN proveedor p ON pdc.id_proveedor = p.id_proveedor
    INNER JOIN material m ON pdc.id_material = m.id_material
    INNER JOIN compra cm ON pdc.id_compra = cm.id_compra
    WHERE pdc.id_compra_detalle = ?
  `;

  req.db.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Error al obtener el detalle de compra de material.' });
    }
    if (result.length === 0) {
      return res.status(404).send({ error: 'Detalle de compra de material no encontrado.' });
    }
    res.json(result[0]);
  });
});

// Crear un nuevo detalle de compra de material
router.post('/', (req, res) => {
  const { cantidad, precio_compra, id_proveedor, id_compra, id_material } = req.body;

  const query = `
    INSERT INTO compra_detalle (cantidad, precio_compra, id_proveedor, id_compra, id_material)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [cantidad, precio_compra, id_proveedor, id_compra, id_material];

  req.db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Error al crear el detalle de compra de material.' });
    }
    res.status(201).send({ message: 'Detalle de compra de material creado con éxito.', id: result.insertId });
  });
});

// Actualizar un detalle de compra de material por ID
router.put('/:id', (req, res) => {
  const { cantidad, precio_compra, id_proveedor, id_compra, id_material } = req.body;

  const query = `
    UPDATE compra_detalle
    SET cantidad = ?, precio_compra = ?, id_proveedor = ?, id_compra = ?, id_material = ?
    WHERE id_compra_detalle = ?
  `;
  const values = [cantidad, precio_compra, id_proveedor, id_compra, id_material, req.params.id];

  req.db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Error al actualizar el detalle de compra de material.' });
    }
    res.send({ message: 'Detalle de compra de material actualizado con éxito.' });
  });
});

// Eliminar un detalle de compra de material por ID
router.delete('/:id', (req, res) => {
  const query = `
    DELETE FROM compra_detalle
    WHERE id_compra_detalle = ?
  `;

  req.db.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Error al eliminar el detalle de compra de material.' });
    }
    res.send({ message: 'Detalle de compra de material eliminado con éxito.' });
  });
});

module.exports = router;
