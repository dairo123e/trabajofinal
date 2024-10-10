const db = require("../database/conexion.js");

class ProfesoresController {
    constructor() {} // constructor bien definido

    // Función para consultar todos los profesores
    consultar(req, res) {
        try {
            db.query('SELECT * FROM profesores', [], (err, rows) => {
                if (err) {
                    res.status(400).send(err.message);
                }
                res.status(200).json(rows);
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    // Función para consultar un profesor por ID
    consultarDetalle(req, res) {
        const { id } = req.params;
        try {
            db.query('SELECT * FROM profesores WHERE id = ?', [id], (err, rows) => {
                if (err) {
                    res.status(400).send(err.message);
                }
                res.status(200).json(rows[0]);
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    // Función para ingresar un nuevo profesor
    ingresar(req, res) {
        const { dni, nombre, apellidos, email, profecion, telefono } = req.body;
        try {
            db.query(
                'INSERT INTO profesores (dni, nombre, apellidos, email, profecion, telefono) VALUES (?, ?, ?, ?, ?, ?)',
                [dni, nombre, apellidos, email, profecion, telefono],
                (err, rows) => {
                    if (err) {
                        res.status(400).send(err.message);
                    } else {
                        res.status(201).json({ id: rows.insertId });
                    }
                }
            );
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    // Función para actualizar un profesor
    actualizar(req, res) {
        const { id } = req.params;
        const { dni, nombre, apellidos, email, profecion, telefono } = req.body;
        try {
            db.query(
                'UPDATE profesores SET dni = ?, nombre = ?, apellidos = ?, email = ?, profecion = ?, telefono = ? WHERE id = ?',
                [dni, nombre, apellidos, email, profecion, telefono, id],
                (err, rows) => {
                    if (err) {
                        res.status(400).send(err.message);
                    }
                    if (rows.affectedRows == 1) {
                        res.status(200).json({ respuesta: "Registro actualizado correctamente" });
                    }
                }
            );
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    // Función para borrar un profesor
    borrar(req, res) {
        const { id } = req.params;
        try {
            db.query('DELETE FROM profesores WHERE id = ?', [id], (err, rows) => {
                if (err) {
                    res.status(400).send(err.message);
                }
                if (rows.affectedRows == 1) {
                    res.status(200).json({ respuesta: "Registro borrado correctamente" });
                }
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
}

module.exports = new ProfesoresController();
