const express = require('express');
const router = express.Router();

// Ruta para registrar un trabajador
router.post('/', (req, res) => {
    console.log(req.db); // Verifica si req.db está definido
    const { dni, nombre_completo, ciudad, direccion, celular, pago_dia, fecha_ingreso, estado } = req.body;
    const SQL = 'INSERT INTO personal (dni, nombre_completo, ciudad, direccion, celular, pago_dia, fecha_ingreso, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const Values = [dni, nombre_completo, ciudad, direccion, celular, pago_dia, fecha_ingreso, estado];

    req.db.query(SQL, Values, (err, results) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        res.send({ message: 'Trabajador registrado con éxito', id_personal: results.insertId });
    });
});

// Ruta para listar todos los trabajadores
router.get('/', (req, res) => {
    const SQL = 'SELECT * FROM personal';

    req.db.query(SQL, (err, results) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        res.send(results);
    });
});

// Ruta para obtener un solo trabajador por ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const SQL = 'SELECT * FROM personal WHERE id_personal = ?';
    const Values = [id];

    req.db.query(SQL, Values, (err, results) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        if (results.length > 0) {
            res.send(results[0]);
        } else {
            res.send({ message: 'Trabajador no encontrado' });
        }
    });
});

// Ruta para editar un trabajador
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { dni, nombre_completo, ciudad, direccion, celular, pago_dia, fecha_ingreso, estado } = req.body;
    const SQL = 'UPDATE personal SET dni = ?, nombre_completo = ?, ciudad = ?, direccion = ?, celular = ?, pago_dia = ?, fecha_ingreso = ?, estado = ? WHERE id_personal = ?';
    const Values = [dni, nombre_completo, ciudad, direccion, celular, pago_dia, fecha_ingreso, estado, id];

    req.db.query(SQL, Values, (err, results) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        if (results.affectedRows > 0) {
            res.send({ message: 'Trabajador actualizado con éxito' });
        } else {
            res.send({ message: 'Trabajador no encontrado o no se realizaron cambios' });
        }
    });
});

// Ruta para eliminar un trabajador
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const SQL = 'DELETE FROM personal WHERE id_personal = ?';
    const Values = [id];

    req.db.query(SQL, Values, (err, results) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        if (results.affectedRows > 0) {
            res.send({ message: 'Trabajador eliminado con éxito' });
        } else {
            res.send({ message: 'Trabajador no encontrado' });
        }
    });
});

// Exportar las rutas
module.exports = router;
