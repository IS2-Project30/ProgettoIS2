const request = require('supertest');
const app = require('./app');
const Collection = require('./models/Collection');
const Object = require('./models/Object');
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
    const result = await Object.remove({name: 'OggettoTest', id_coll: '5fbe86ef4a74553b94f18d15'});
    mongoose.connection.close(true);
    console.log('Database disconnesso');
});

test('GET /api/v1/objects Errore per mancanza di token negli header, errore intercettato da tokenChecker', () => {
    return request(app)
        .get('/api/v1/objects')
        .expect(401, {success: false, message: 'Nessun token fornito.'});
});

test('GET /api/v1/objects Token non più valido, errore intercettato da tokenChecker', () => {
    const token = jwt.sign({email: 'marco@gmail.com'}, process.env.SUPER_SECRET, { expiresIn: -10 });
    return request(app)
        .get('/api/v1/objects')
        .set('token', token)
        .expect(403, {success: false, message: 'Fallimento autenticazione token.'});
});

test('GET /api/v1/objects Campo id_coll non compilato', () => {
    const token = jwt.sign({email: 'marco@gmail.com'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .get('/api/v1/objects')
        .set('token', token)
        .expect(400, {success: false, message: "Campo id_coll non fornito."});
});

test('GET /api/v1/objects Nessun oggetto trovato', () => {
    const token = jwt.sign({email: 'marco@gmail.com'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .get('/api/v1/objects?id_coll=5fbe86ef4a74553b94f18d15')
        .set('token', token)
        .expect(200, {success: true, message: "Non ci sono oggetti"});
});

test("POST /api/v1/objects Nome per l'oggetto non valido", () => {
    const token = jwt.sign({email: 'marco@gmail.com'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .post('/api/v1/objects')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({id_coll: '5fbe86ef4a74553b94f18d15', name: ''})
        .expect(400, {success: false, message: "Nome non valido."});
});

test('POST /api/v1/objects id_coll mancante', () => {
    const token = jwt.sign({email: 'marco@gmail.com'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .post('/api/v1/objects')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({name: 'Oggetto1'})
        .expect(400, {success: false, message: "id_coll mancante."});
});

test("POST /api/v1/objects id_coll non rispetta la forma corretta", () => {
    const token = jwt.sign({email: 'marco@gmail.com'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .post('/api/v1/objects')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({id_coll: 'nonEsiste', name: 'OggettoTest'})
        .expect(400, {success: false, message: "id_coll errato."});
});

test("POST /api/v1/objects id_coll corretto ma non esistente", () => {
    const token = jwt.sign({email: 'marco@gmail.com'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .post('/api/v1/objects')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({id_coll: '5fbe86ef4a72543b94f18d15', name: 'OggettoTest'})
        .expect(404, {success: false, message: "Non esiste una collezione con tale id."});
});

test('POST /api/v1/objects Oggetto creato correttamente', () => {
    const token = jwt.sign({email: 'marco@gmail.com'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .post('/api/v1/objects')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({id_coll: '5fbe86ef4a74553b94f18d15', name: 'OggettoTest'})
        .expect(201, {success: true, message: "Oggetto creato."});
});
/* DA RIVEDERE
test('GET /api/v1/objects Restituisce tutti gli oggetti appartenenti ad una classe', () => {
    const token = jwt.sign({email: 'marco@gmail.com'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .get('/api/v1/objects?id_coll=fbe86ef4a74553b94f18d15')
        .set('token', token)
        .expect(200); 
});
*/
