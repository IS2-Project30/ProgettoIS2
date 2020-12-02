const request = require('supertest');
const app = require('./app');
const Collection = require('./models/Collection');
const Obj = require('./models/Object');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const id_coll_obj = "5fc7ee8a2b95d70adc1a7ffb"; // id di CollezioneTest1
const id_coll_vuota = "5fc7ee8f2b95d70adc1a7ffc"; // id di CollezioneTest2

let connections;

beforeAll( async () => {
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = await mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connesso');
});

afterAll( async () => {
    //const result = await Obj.deleteOne({name: 'OggettoTest', id_coll: id_coll_vuota}); // Decommentare se delete 200 commentata
    mongoose.connection.close(true);
    console.log('Database disconnesso');
});

test('GET /api/v1/objects Errore per mancanza di token negli header, errore intercettato da tokenChecker', () => {
    return request(app)
        .get('/api/v1/objects')
        .expect(401, {success: false, message: 'Nessun token fornito.'});
});

test('GET /api/v1/objects Token non più valido, errore intercettato da tokenChecker', () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: -10 });
    return request(app)
        .get('/api/v1/objects')
        .set('token', token)
        .expect(403, {success: false, message: 'Fallimento autenticazione token.'});
});

test('GET /api/v1/objects Campo id_coll non compilato', () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .get('/api/v1/objects')
        .set('token', token)
        .expect(400, {success: false, message: "Campo id_coll non fornito."});
});

test('GET /api/v1/objects Nessun oggetto trovato', () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .get('/api/v1/objects?id_coll=' + id_coll_vuota)
        .set('token', token)
        .expect(200, {success: true, message: "Non ci sono oggetti"});
});

test("POST /api/v1/objects Nome per l'oggetto non valido", () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .post('/api/v1/objects')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({id_coll: id_coll_vuota, name: ''})
        .expect(400, {success: false, message: "Nome non valido."});
});

test('POST /api/v1/objects id_coll mancante', () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .post('/api/v1/objects')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({name: 'Oggetto1'})
        .expect(400, {success: false, message: "id_coll mancante."});
});

test("POST /api/v1/objects id_coll non rispetta la forma corretta", () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .post('/api/v1/objects')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({id_coll: 'nonEsiste', name: 'OggettoTest'})
        .expect(400, {success: false, message: "id_coll errato."});
});

test("POST /api/v1/objects id_coll corretto ma non esistente", () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .post('/api/v1/objects')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({id_coll: '1aa1aa1a1a11a11aaa1a1aaa', name: 'OggettoTest'})
        .expect(404, {success: false, message: "Non esiste una collezione con tale id."});
});

test('POST /api/v1/objects Oggetto creato correttamente', () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .post('/api/v1/objects')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({id_coll: id_coll_vuota, name: 'OggettoTest'})
        .expect(201);
});

test('DELETE /api/v1/objects Campo id_obj non fornito', () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .delete('/api/v1/objects')
        .set('token', token)
        .set('content-type', 'application/json')
        .expect(400, {success: false, message: 'id_obj mancante.'});
});

test('DELETE /api/v1/objects Campo id_obj errato', () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .delete('/api/v1/objects')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({id_obj: '6questo83id131è38errato89'})
        .expect(400, {success: false, message: 'id_obj errato.'});
});
// DA TENERE SOTTO OSSERVAZIONE
test('GET /api/v1/objects Restituisce tutti gli oggetti appartenenti ad una collezione', () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .get('/api/v1/objects?id_coll=' + id_coll_obj)
        .set('token', token)
        .expect(200); 
});
// DA TENERE SOTTO OSSERVAZIONE
test('DELETE /api/v1/objects Oggetto eliminato correttamente', async () => { // Elimina oggetto creato nel precedente test
    const id = await Obj.findOne({name: 'OggettoTest', id_coll: id_coll_vuota});
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .delete('/api/v1/objects')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({id_obj: id._id})
        .expect(200, {success: true, message: 'Oggetto eliminato.'});
});
