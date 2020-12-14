const request = require('supertest');
const app = require('./app');
const Blacklist = require('./models/Collection');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

let connections;

beforeAll( async () => {
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = await mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connesso');
});

afterAll( async () => {
    mongoose.connection.close(true);
    console.log('Database disconnesso');
});

test('POST /api/v1/logout Errore per mancanza di token negli header, errore intercettato da tokenChecker', () => {
    return request(app)
        .post('/api/v1/logout')
        .expect(401, {success: false, message: 'Nessun token fornito.'});
});

test('POST /api/v1/logout Token non più valido, errore intercettato da tokenChecker', () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: -10 });
    return request(app)
        .post('/api/v1/logout')
        .set('token', token)
        .expect(403, {success: false, message: 'Fallimento autenticazione token.'});
});

var token;

test('POST /api/v1/logout Logout effettuato correttamente', () => {
    token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 60 });
    return request(app)
        .post('/api/v1/logout')
        .set('token', token)
        .expect(200, {success: true, message: 'Logout corretto.'});
});

test('POST /api/v1/logout Logout già effettuato, errore intercettato da tokenChecker', () => {
    return request(app)
        .post('/api/v1/logout')
        .set('token', token)
        .expect(401, {success: false, message: 'Logout già effettuato.'});
});
