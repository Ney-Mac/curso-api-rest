const express = require('express');
const router = express.Router();
const mysql = require('../mysql');

//Retorna todos os produtos
router.get('/', (req, res, nest) => {
    // res.status(200).send({
    //     mensagem: 'Retorna todos os produtos'
    // });
    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM produto;',
            (error, resultado, field) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }

                res.status(200).send({
                    response: resultado
                });

            }
        )
    })
});

//Insere um produto
router.post('/', (req, res, next) => {
    const produto = {
        nome: req.body.nome,
        preco: req.body.preco,
    };

    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        conn.query(
            'INSERT INTO produto(nome, preco) VALUES(?,?)',
            [req.body.nome, req.body.preco],
            (error, resultado, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error
                    });
                }

                res.status(201).send({
                    mensagem: 'Produto inserido com sucesso',
                    id_produto: resultado.insertId,
                });

            }
        );
    });
});

//Retorna os dados de um produto
router.get('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `SELECT * FROM produto WHERE produto.id_produto = ?`,
            [req.params.id_produto],
            (error, resultado, field) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }

                return res.status(200).send({ response: resultado })
            }
        )
    })
});

/*
UPDATE produto SET nome = "A Mumia 2", preco = 69.90 WHERE id_produto = 2;
*/

//Altera um produto
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `UPDATE produto
                SET 
                    nome = ?,
                    preco = ?
                WHERE
                    id_produto = ?
            ;`,
            [
                req.body.nome,
                req.body.preco,
                req.body.id_produto
            ],
            (error, resultado, field) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }

                res.status(202).send({
                    mensagem: 'Produto actualizado com sucesso'
                });
            }
        )
    })
});

//Exclui um produto
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `DELETE FROM produto WHERE id_produto = ?`,
            [req.body.id_produto],
            (error, resultado, field) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }

                res.status(202).send({
                    mensagem: 'Produto removido com sucesso'
                });
            }
        )
    })
});

module.exports = router;