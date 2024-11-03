const empresaController = {
    // Crear una nueva empresa
    createEmpresa: (req, res) => {
        const { razon_social, ruc, ciudad, direccion, telefono, email, web, logo } = req.body;
        const SQL = 'INSERT INTO empresa (razon_social, ruc, ciudad, direccion, telefono, email, web, logo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [razon_social, ruc, ciudad, direccion, telefono, email, web, logo];

        req.db.query(SQL, values, (err, results) => {
            if (err) return res.status(500).send({ error: err });
            res.status(201).send({ message: 'Empresa creada con éxito', id_empresa: results.insertId });
        });
    },

    // Obtener todas las empresas
    getAllEmpresas: (req, res) => {
        const SQL = 'SELECT * FROM empresa';

        req.db.query(SQL, (err, results) => {
            if (err) return res.status(500).send({ error: err });
            res.send(results);
        });
    },

    // Obtener una empresa por ID
    getEmpresaById: (req, res) => {
        const id = req.params.id;
        const SQL = 'SELECT * FROM empresa WHERE id_empresa = ?';

        req.db.query(SQL, [id], (err, results) => {
            if (err) return res.status(500).send({ error: err });
            if (results.length > 0) res.send(results[0]);
            else res.status(404).send({ message: 'Empresa no encontrada' });
        });
    },

    // Actualizar una empresa
    updateEmpresa: (req, res) => {
        const id = req.params.id;
        const { razon_social, ruc, ciudad, direccion, telefono, email, web, logo } = req.body;
        const SQL = 'UPDATE empresa SET razon_social = ?, ruc = ?, ciudad = ?, direccion = ?, telefono = ?, email = ?, web = ?, logo = ? WHERE id_empresa = ?';
        const values = [razon_social, ruc, ciudad, direccion, telefono, email, web, logo, id];

        req.db.query(SQL, values, (err, results) => {
            if (err) return res.status(500).send({ error: err });
            if (results.affectedRows > 0) res.send({ message: 'Empresa actualizada con éxito' });
            else res.status(404).send({ message: 'Empresa no encontrada o sin cambios' });
        });
    },

    // Eliminar una empresa
    deleteEmpresa: (req, res) => {
        const id = req.params.id;
        const SQL = 'DELETE FROM empresa WHERE id_empresa = ?';

        req.db.query(SQL, [id], (err, results) => {
            if (err) return res.status(500).send({ error: err });
            if (results.affectedRows > 0) res.send({ message: 'Empresa eliminada con éxito' });
            else res.status(404).send({ message: 'Empresa no encontrada' });
        });
    }
};

module.exports = empresaController;
