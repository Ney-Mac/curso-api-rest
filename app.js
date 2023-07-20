const express = require('express');
const app = express();

app.use((req, res, next) => {
    //req -> request - requisição
    //res -> response - resposta
    //next -> para chamar outro método

    res.status(200).send({
        mensagem: 'Ok, deu certo'
    })
});

module.exports = app;