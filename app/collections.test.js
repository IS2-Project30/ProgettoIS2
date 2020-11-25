
// INCOMPLETA, MANCANO LE POST. VERRANNO IMPLEMENTATE AD AVVENUTA MODIFICA DI creaCollezioni.html e crea.js

const request = require('supertest');
const app = require('./app');
const User = require('./models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

let connections;

beforeAll( async () => {
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = await mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connesso');
});

afterAll( () => {
    mongoose.connection.close(true);
    console.log('Database disconnesso');
});

test('GET /api/v1/collections Errore per mancanza di token negli header, errore intercettato da tokenChecker', () => {
    return request(app)
        .get('/api/v1/collections')
        .expect(401, {success: false, message: 'Nessun token fornito.'});
});

test('GET /api/v1/collections Token non più valido, errore intercettato da tokenChecker', () => {
    const token = jwt.sign({email: 'marco@gmail.com'}, process.env.SUPER_SECRET, { expiresIn: -10 });
    return request(app)
        .get('/api/v1/collections')
        .set('token', token)
        .expect(403, {success: false, message: 'Fallimento autenticazione token.'});
});

test("GET /api/v1/collections Nessuna collezione associata all'utente identificato tramite email", () => {
    const token = jwt.sign({email: 'manuel@gmail.com'}, process.env.SUPER_SECRET, { expiresIn: 10 })
    return request(app)
        .get('/api/v1/collections')
        .set('token', token)
        .expect(404);
});

test("GET /api/v1/collections Ottiene array contenente i nomi delle collezioni appartenenti all'utente identificato tramite email", () => {
    const token = jwt.sign({email: 'marco@gmail.com'}, process.env.SUPER_SECRET, { expiresIn: 10 })
    return request(app)
        .get('/api/v1/collections')
        .set('token', token)
        .expect(200);
});
