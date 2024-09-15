import express from 'express';
import { PrismaClient } from '@prisma/client';

/* TODO: CRUD USUÁRIOS

    1º - Criar usuários
    2º - Listar usuários
    3º - Ediar usuários
    4º - Deletar usuários

*/

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.post('/users', async (req, res) => {

    await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })

    res.status(201).json(users);
})

app.get('/users', async (request, response) => {

    const users = await prisma.user.findMany()

    response.status(200).json(users);
});

app.put('/users/:hash', async (req, res) => {
    await prisma.user.update({
        where: {
            id: req.params.hash
        },
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })

    res.status(201);
})

app.listen(3000);