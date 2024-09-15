import { express, request } from 'express';

const app = express();

app.get('/users', (request, response) => {
    response.send('Resposta.');
});

app.listen(3000);