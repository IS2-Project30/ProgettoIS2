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
    //const result = await Collection.remove({name: 'CollezioneTest', email: 'test@test.it'}); // Decommentare se delete 200 commentata
    const result = await Collection.findOneAndUpdate( {_id: '5fc7ee8a2b95d70adc1a7ffb'},{name: 'CollezioneTest1'});
    mongoose.connection.close(true);
    console.log('Database disconnesso');
});

test('GET /api/v1/collections Errore per mancanza di token negli header, errore intercettato da tokenChecker', () => {
    return request(app)
        .get('/api/v1/collections')
        .expect(401, {success: false, message: 'Nessun token fornito.'});
});

test('GET /api/v1/collections Token non più valido, errore intercettato da tokenChecker', () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: -10 });
    return request(app)
        .get('/api/v1/collections')
        .set('token', token)
        .expect(403, {success: false, message: 'Fallimento autenticazione token.'});
});
/*
test("GET /api/v1/collections Nessuna collezione associata all'utente identificato tramite email", () => {
    const token = jwt.sign({email: 'no_coll@gmail.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .get('/api/v1/collections')
        .set('token', token)
        .expect(200, {success: true, message: "Non esistono collezioni."});
});
*/
test("GET /api/v1/collections Ottiene array contenente i nomi delle collezioni appartenenti all'utente identificato tramite email", () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .get('/api/v1/collections')
        .set('token', token)
        .expect(200);
});

test("POST /api/v1/collections Nome per la collezione non valido", () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .post('/api/v1/collections')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({coll: {name: ''}})
        .expect(400, {success: false, message: "Nome non valido."});
});

test("POST /api/v1/collections Crea una collezione con nome indicato", () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .post('/api/v1/collections')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({coll: {name: 'CollezioneTest'}})
        .expect(201);
});

test("POST /api/v1/collections Una collezione col nome indicato esiste già", () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .post('/api/v1/collections')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({coll: {name: 'CollezioneTest2'}})
        .expect(409, {success: false, message: "Una collezione con questo nome esiste già."});
});

test("DELETE /api/v1/collections Campo id_coll non fornito", () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .delete('/api/v1/collections')
        .set('token', token)
        .set('content-type', 'application/json')
        .expect(400, {success: false, message: 'id_coll mancante.'});
});

test("DELETE /api/v1/collections Campo id_coll errato", () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .delete('/api/v1/collections')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({id_coll: '2questo79id638è51errato03'})
        .expect(400, {success: false, message: 'id_coll errato.'});
});

test("DELETE /api/v1/collections Non esiste una collezione di id id_coll", () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .delete('/api/v1/collections')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({id_coll: '1aa1aa1a1a11a11aaa1a1aaa'})
        .expect(404, {success: false, message: "Non esiste una collezione con tale id."});
});
// DA TENERE SOTTO OSSERVAZIONE
test("DELETE /api/v1/collections Collezione eliminata", async () => {
    const id = await Collection.findOne({name: 'CollezioneTest', email: 'test@test.it'});
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .delete('/api/v1/collections')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({id_coll: id._id})
        .expect(200, {success: true, message: 'Collezione eliminata.'});
});

test('PATCH /api/v1/collections/:collId campo nuovoNome assente', async () => {
	const id = await Collection.findOne({name: 'CollezioneTest1', email: 'test@test.it'});
	const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
	return request(app)
        .patch('/api/v1/collections/' + id._id)
        .set('token', token)
        .set('content-type', 'application/json')
        .expect(400, {success: false, message: "Non esiste un nuovo nome."});
});

test('PATCH /api/v1/collections/:collId con collId non valido', async () => {
	const id = 'hgah9q283hg194hg9ahq';
	const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
	const nuovoNome = 'CollezioneModificata';
	return request(app)
        .patch('/api/v1/collections/' + id)
        .set('token', token)
        .set('content-type', 'application/json')
        .send({nuovoNome: nuovoNome})
        .expect(400, {success: false, message: "collId errato."});
});

test('PATCH /api/v1/collections/:collId modifica avvenuta con successo', async () => {
	const id = await Collection.findOne({name: 'CollezioneTest1', email: 'test@test.it'});
	const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
	const nuovoNome = 'CollezioneModificata';
	return request(app)
        .patch('/api/v1/collections/' + id._id)
		.set('token', token)
        .set('content-type', 'application/json')
        .send({nuovoNome: nuovoNome})
        .expect(201, {success: true, message: "Collezione aggiornata con successo."});
});