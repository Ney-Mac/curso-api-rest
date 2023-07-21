const express = require('express');
const router = express.Router();
const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

router.post('/login', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        const query = `SELECT * FROM usuarios WHERE email = ?`;

        conn.query(query, [req.body.email], (error, results, fields) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }

            if (results.length < 1) {
                return res.status(401).send({ message: 'Falha na autenticação' })
            }

            bcrypt.compare(req.body.password, results[0].password, (err, result) => {
                if (err) {
                    return res.status(401).send({ message: 'Falha na autenticação' })
                }

                if (result) {
                    const token = jwt.sign(
                        {
                            id_usuario: results[0].id_usuario,
                            email: results[0].email
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );

                    return res.status(200).send({
                        message: 'Autenticado com sucesso',
                        token: token
                    });
                }

                return res.status(401).send({ message: 'Falha na autenticação' });
            })
        })
    })
})

module.exports = router;