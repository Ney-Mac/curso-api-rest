const express = require('express');
const router = express.Router();

//Retorna todos os pedidos
router.get('/', (req, res, nest) => {
    res.status(200).send({
        mensagem: 'Retorna os pedidos'
    });
});

//Insere um pedido
router.post('/', (req, res, next) => {
    const pedido = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade,
    }

    res.status(201).send({
        mensagem: 'O pedido foi criado',
        pedidoCriado: pedido,
    });
});

//Retorna os dados de um pedido
router.get('/:id_pedido', (req, res, next) => {
    const id_pedido = req.params.id_pedido;

    res.status(200).send({
        mensagem: 'Detalhes do pedido',
        id: id_pedido 
    });
});

//Exclui um pedido
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando  Delete dentro da rota de pedidos'
    });
});

module.exports = router;