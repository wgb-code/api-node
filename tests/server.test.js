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

        let createdUser = await prisma.user.create({
            data: {
                email: 'update@example.com',
                name: 'Update User',
                age: '20',
            },
        });

        let updatedData = {
            email: 'updated@example.com',
            name: 'Updated User',
            age: '30',
        };

        let response = await request(app)
            .put(`/users/${createdUser.id}`)
            .send(updatedData);

        expect(
            response.status
        ).toBe(201);

        let updatedUser = await prisma.user.findUnique({
            where: { id: createdUser.id },
        });

        expect(
            updatedUser
        ).toBeTruthy();

        expect(
            updatedUser
        ).toMatchObject(updatedData);

    }, 20000);
});
