import express from 'express'
import validator from 'validator'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors())

app.post('/users', async (req, res) => {

    let { email, name, age } = req.body;

    let errors = [];

    if (!email) {
        errors.push('Por favor, insira um endereço de email no formato exemplo@dominio.com');

    } else if (!validator.isEmail(email) || email.length < 10 || email.length > 50) {
        errors.push('O endereço de email deve ter entre 10 e 50 caracteres e estar no formato válido.');
    }

    if (!name) {
        errors.push('Por favor, insira o nome do usuário');

    } else if (name.length < 4 || name.length > 50) {
        errors.push('O nome deve ter entre 4 e 50 letras.');
    }

    if (!age) {
        errors.push('Por favor, insira a idade do usuário.');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            messages: errors
        });

    } else {
        await prisma.user.create({
            data: { email, name, age }
        });

        res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
    }
})

app.get('/users', async (req, res) => {

    let users = []

    if (req.query) {
        users = await prisma.user.findMany({
            where: {
                email: req.query.email,
                name: req.query.name,
                age: req.query.age
            }
        });

    } else {
        users = await prisma.user.findMany()
    }

    res.status(200).json(users)
});

app.put('/users/:id', async (req, res) => {

    await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })

    res.status(201).json({ message: 'Usuário atualizado com sucesso.' });
});

app.delete('/users/:id', async (req, res) => {

    let getID = req.params.id;

    await prisma.user.delete({
        where: {
            id: getID
        }
    })

    res.status(200).json({message: "Usuário exclúido com sucesso."})
});

app.listen(3000);

export { app, prisma };