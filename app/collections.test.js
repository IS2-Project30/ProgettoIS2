
// INCOMPLETA.

const request = require('supertest');
const app = require('./app');
const Collection = require('./models/Collection');
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
    const result = await Collection.remove({name: 'CollezioneTest', email: 'marco@gmail.com'});
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
        .expect(404, {success: false, message: "Non esistono collezioni."});
});

test("GET /api/v1/collections Ottiene array contenente i nomi delle collezioni appartenenti all'utente identificato tramite email", () => {
    const token = jwt.sign({email: 'marco@gmail.com'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .get('/api/v1/collections')
        .set('token', token)
        .expect(200);
});

test("POST /api/v1/collections Nome per la collezione non valido", () => {
    const token = jwt.sign({email: 'marco@gmail.com'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .post('/api/v1/collections')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({name: ''})
        .expect(400, {success: false, message: "Nome non valido."});
});

test("POST /api/v1/collections Crea una collezione con nome indicato", () => {
    const token = jwt.sign({email: 'marco@gmail.com'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .post('/api/v1/collections')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({name: 'CollezioneTest'})
        .expect(201, {success: true, message: "Collezione creata."});
});

test("POST /api/v1/collections Una collezione col nome indicato esiste già", () => {
    const token = jwt.sign({email: 'marco@gmail.com'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .post('/api/v1/collections')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({name: 'CollezioneTest'})
        .expect(409, {success: false, message: "Una collezione con questo nome esiste già."});
});
