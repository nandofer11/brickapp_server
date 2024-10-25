const express = require('express');
const router = express.Router();



// Obtener todas las compras de material
router.get('/', (req, res) => {
  const query = `SELECT * FROM compra_material`;

  req.db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send({ error: 'Error al obtener las compras de material.' });
    }
    res.json(results);
  });
});

// Obtener una compra de material por ID
router.get('/:id', (req, res) => {
  const query = `SELECT * FROM compra_material WHERE id_compra_material = ?`;

  req.db.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Error al obtener la compra de material.' });
    }
    if (result.length === 0) {
      return res.status(404).send({ error: 'Compra de material no encontrada.' });
    }
    res.json(result[0]);
  });
});

// Crear una nueva compra de material
router.post('/', (req, res) => {
  const { fecha_compra, estado_pago } = req.body;

  const query = `
    INSERT INTO compra_material (fecha_compra, estado_pago)
    VALUES (?, ?)
  `;
  const values = [fecha_compra, estado_pago];

  req.db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Error al crear la compra de material.' });
    }
    res.status(201).send({ message: 'Compra de material creada con éxito.', id: result.insertId });
  });
});

// Actualizar una compra de material por ID
router.put('/:id', (req, res) => {
  const { fecha_compra, estado_pago } = req.body;

  const query = `
    UPDATE compra_material
    SET fecha_compra = ?, estado_pago = ?
    WHERE id_compra_material = ?
  `;
  const values = [fecha_compra, estado_pago, req.params.id];

  req.db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Error al actualizar la compra de material.' });
    }
    res.send({ message: 'Compra de material actualizada con éxito.' });
  });
});

// Eliminar una compra de material por ID
router.delete('/:id', (req, res) => {
  const query = `
    DELETE FROM compra_material
    WHERE id_compra_material = ?
  `;

  req.db.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Error al eliminar la compra de material.' });
    }
    res.send({ message: 'Compra de material eliminada con éxito.' });
  });
});

module.exports = router;
