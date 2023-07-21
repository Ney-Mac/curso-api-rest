const express = require('express');
const router = express.Router();
const mysql = require('../mysql');
const bcrypt = require('bcrypt');

router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `SELECT * FROM usuarios WHERE email = ?`,
            [req.body.email],
            (error, results) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                if (results.length > 0) {
                    return res.status(409).send({ message: 'Usuario já cadastrado' })
                } else {
                    bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
                        if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }

                        conn.query(
                            `INSERT INTO usuarios(email, password) VALUES(?, ?)`,
                            [req.body.email, hash],
                            (error, results) => {
                                conn.release();
                                if (error) { return res.status(500).send({ error: error }) }

                                const response = {
                                    message: 'Usuario criado com sucesso',
                                    usuario: {
                                        id: results.insertId,
                                        email: req.body.email,
                                    }
                                }

                                return res.status(201).send(response);

                            }
                        )
                    })
                }
            }
        )
    });
});

module.exports = router;