import request from 'supertest';
import { app, prisma } from '../server';

describe('API de Usuários', () => {

    afterAll(async () => {
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    it('Deve criar um novo usuário', async () => {

        let newUser = {
            email: 'test@example.com',
            name: 'Test User',
            age: '30',
        };

        let response = await request(app)
            .post('/users')
            .send(newUser);

        expect(response.status).toBe(201);

        let user = await prisma.user.findUnique({
            where: { email: newUser.email },
        });

        expect(user).toBeTruthy();
        expect(user).toMatchObject(newUser);

    }, 10000);

    it('Deve retornar todos os usuários', async () => {
        await prisma.user.create({
            data: {
                email: 'filter@example.com',
                name: 'Filter User',
                age: '25',
            },
        });

        let response = await request(app).get('/users');

        expect(
            response.status
        ).toBe(200);

        expect(
            Array.isArray(response.body)
        ).toBe(true);

        expect(
            response.body.length
        ).toBeGreaterThan(0);

    }, 10000);

    it('Deve retornar usuários filtrados por email', async () => {
        let response = await request(app)
            .get('/users')
            .query({ email: 'filter@example.com' });

        expect(
            response.status
        ).toBe(200);

        expect(
            Array.isArray(response.body)
        ).toBe(true);

        expect(
            response.body.length
        ).toBe(1);

        expect(
            response.body[0]
        ).toMatchObject({
            email: 'filter@example.com',
            name: 'Filter User',
            age: '25',
        });

    }, 10000);

    it('Deve retornar usuários filtrados por nome', async () => {

        let response = await request(app)
            .get('/users')
            .query({ name: 'Filter User' });

        expect(
            response.status
        ).toBe(200);

        expect(
            Array.isArray(response.body)
        ).toBe(true);

        expect(
            response.body.length
        ).toBe(1);

        expect(response.body[0]).toMatchObject({
            email: 'filter@example.com',
            name: 'Filter User',
            age: '25',
        });

    }, 10000);

    it('Deve retornar usuários filtrados por idade', async () => {

        let response = await request(app)
            .get('/users')
            .query({ age: '25' });

        expect(
            response.status
        ).toBe(200);

        expect(
            Array.isArray(response.body)
        ).toBe(true);

        expect(
            response.body.length
        ).toBe(1);

        expect(
            response.body[0]
        ).toMatchObject({
            email: 'filter@example.com',
            name: 'Filter User',
            age: '25',
        });

    }, 10000);

    it('Deve retornar usuários filtrados por múltiplos parâmetros', async () => {

        let response = await request(app)
            .get('/users')
            .query({ email: 'filter@example.com', name: 'Filter User' });

        expect(
            response.status
        ).toBe(200);

        expect(
            Array.isArray(response.body)
        ).toBe(true);

        expect(
            response.body.length
        ).toBe(1);

        expect(
            response.body[0]
        ).toMatchObject({
            email: 'filter@example.com',
            name: 'Filter User',
            age: '25',
        });
    }, 10000);

    it('Deve atualizar um usuário existente', async () => {

        let user = await prisma.user.create({
            data: {
                email: 'update@example.com',
                name: 'Update User',
                age: '40',
            },
        });

        let updatedUser = {
            email: 'updated@example.com',
            name: 'Updated User',
            age: '45',
        };

        let response = await request(app)
            .put(`/users/${user.id}`)
            .send(updatedUser);

        expect(
            response.status
        ).toBe(201);

        expect(
            response.body.message
        ).toBe('Usuário atualizado com sucesso.');

        let updatedUserFromDb = await prisma.user.findUnique({
            where: { id: user.id },
        });

        expect(
            updatedUserFromDb
        ).toBeTruthy();

        expect(
            updatedUserFromDb
        ).toMatchObject(updatedUser);

    }, 10000);

    it('Deve retornar erro ao tentar atualizar para um email já existente', async () => {

        await prisma.user.create({
            data: {
                email: 'existing@example.com',
                name: 'Existing User',
                age: '50',
            },
        });

        let userToUpdate = await prisma.user.create({
            data: {
                email: 'update@example.com',
                name: 'Update User',
                age: '40',
            },
        });

        let updatedUser = {
            email: 'existing@example.com',
            name: 'Updated User',
            age: '45',
        };

        let response = await request(app)
            .put(`/users/${userToUpdate.id}`)
            .send(updatedUser);

        expect(response.status).toBe(400);

        expect(
            response.body.message
        ).toBe('O email informado já está em uso.');

    });

    it('Deve retornar 404 quando nenhum usuário for encontrado', async () => {

        let response = await request(app)
            .get('/users')
            .query({ email: 'notfound@example.com' });

        expect(response.status).toBe(404);

        expect(response.body.message).toBe('Não foi localizado usuários cadastrados com esses dados.');
    }, 10000);
});

describe('Validações', () => {

    it('Deve retornar erro se o email for inválido', async () => {

        let invalidUser = {
            email: 'invalid-email',
            name: 'Test User',
            age: '30',
        };

        let response = await request(app)
            .post('/users')
            .send(invalidUser);

        expect(response.status).toBe(400);

        expect(
            response.body.messages
        ).toContain(
            'O endereço de email deve ter entre 10 e 50 caracteres e estar no formato válido.'
        );
    });

    it('Deve retornar erro se o nome tiver menos de 4 caracteres', async () => {

        let invalidUser = {
            email: 'test@example.com',
            name: 'Tes',
            age: '30',
        };

        let response = await request(app)
            .post('/users')
            .send(invalidUser);

        expect(response.status).toBe(400);

        expect(
            response.body.messages
        ).toContain('O nome deve ter entre 4 e 50 letras.');
    });

    it('Deve retornar erro se a idade não for fornecida', async () => {

        let invalidUser = {
            email: 'test@example.com',
            name: 'Test User',
            age: '',
        };

        let response = await request(app)
            .post('/users')
            .send(invalidUser);

        expect(response.status).toBe(400);
        expect(
            response.body.messages
        ).toContain('Por favor, insira a idade do usuário.');
    });

    it('Deve retornar erro se faltar o nome ao criar um usuário', async () => {

        let invalidUser = {
            email: 'test@example.com',
            age: '25',
        };

        let response = await request(app)
            .post('/users')
            .send(invalidUser);

        expect(response.status).toBe(400);
        expect(
            response.body.messages
        ).toContain('Por favor, insira o nome do usuário');
    });

    it('Deve retornar erro se tentar atualizar um usuário com email já existente', async () => {

        const existingUser = {
            email: 'existing@example.com',
            name: 'Existing User',
            age: '30',
        };

        await prisma.user.create({ data: existingUser });

        let userToUpdate = await prisma.user.create({
            data: {
                email: 'update@example.com',
                name: 'Update User',
                age: '40',
            },
        });

        let response = await request(app)
            .put(`/users/${userToUpdate.id}`)
            .send({
                email: 'existing@example.com',
                name: 'Updated User',
                age: '45',
            });

        expect(response.status).toBe(400);
        expect(
            response.body.message
        ).toBe('O email informado já está em uso.');
    });
});