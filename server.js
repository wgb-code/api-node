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

        res.status(201).json({ message: 'Usuário cadastrado com sucesso.' })
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

    let getID = req.params.id;
    let { email, name, age } = req.body;

    if (!getID) {
        return res.status(400).json({ message: 'Por favor, informe um usuário válido.' });
    }

    if (!email || !name || !age) {
        return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
    }

    try {

        let getUser = await prisma.user.findUnique({
            where: { id: getID }
        });

        if (!getUser) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        if (email !== getUser.email) {

            let checkEmailIsNotUse = await prisma.user.findUnique({
                where: { email: email }
            });

            if (checkEmailIsNotUse) {
                return res.status(400).json({ message: 'O email informado já está em uso.' });
            }
        }

        await prisma.user.update({
            where: { id: getID },
            data: { email, name, age }
        });

        return res.status(201).json({ message: 'Usuário atualizado com sucesso.' });

    } catch (error) {

        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'O email informado já está em uso.' });
        }

        return res.status(500).json({ message: 'Não foi possível editar as informações, tente novamente.' });
    }
});

app.delete('/users/:id', async (req, res) => {

    let getID = req.params.id;

    if (!getID) {
        return res.status(400).json({ message: 'Por favor, informar usuário válido.' });
    }

    try {

        await prisma.user.delete({
            where: {
                id: getID
            }
        });

        return res.status(200).json({ message: "Usuário excluído com sucesso." });

    } catch (error) {

        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        return res.status(500).json({ message: 'Não foi possível realizar a exclusão, tente novamente.' });
    }
});

app.listen(3000);

export { app, prisma };