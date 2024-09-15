import express from 'express';

/* TODO: CRUD USUÁRIOS

    1º - Criar usuários
    2º - Listar usuários
    3º - Ediar usuários
    4º - Deletar usuários

*/

const app = express();

app.use(express.json());

let users = [];

app.post('/users', (req, res) => {
    users.push(req.body);

    res.status(201).json(users);
})

app.get('/users', (request, response) => {
    response.status(200).json(users);
});

app.listen(3000);