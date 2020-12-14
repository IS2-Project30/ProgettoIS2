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

test('PATCH /api/v1/objects/:objectId modifica avvenuta con successo', async () => {
	const id = await Obj.findOne({name: 'ObjectTest1', id_coll: '5fc7ee8a2b95d70adc1a7ffb'});
	const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
	const lista = { tag_list: [{"tag": "test tag", "valore": "test valore"}] };
	return request(app)
        .patch('/api/v1/objects/' + id._id)
		.set('token', token)
        .set('content-type', 'application/json')
        .send(lista)
        .expect(201, {success: true, message: "Lista di tag aggiornata."});
});

test('PATCH /api/v1/objects/:objectId campo tag_list assente o non valido', async () => {
	const id = await Obj.findOne({name: 'ObjectTest1', id_coll: '5fc7ee8a2b95d70adc1a7ffb'});
	const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
	const lista = { "tag": "test tag", "valore": "test valore" };
	return request(app)
        .patch('/api/v1/objects/' + id._id)
        .set('token', token)
        .set('content-type', 'application/json')
        .send(lista)
        .expect(400, {success: false, message: "Non esiste tag_list o vi son errori di sintassi."});
});

test('PATCH /api/v1/objects/:objectId con objectId non valido', async () => {
	const id = 'hgah9q283hg194hg9ahq';
	const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
	const lista = { tag_list: [{"tag": "test tag", "valore": "test valore"}] };
	return request(app)
        .patch('/api/v1/objects/' + id)
        .set('token', token)
        .set('content-type', 'application/json')
        .send(lista)
        .expect(400, {success: false, message: "objectId errato."});
});

test('PATCH /api/v1/objects/:objectId tag presente ma vuoto', async () => {
	const id = await Obj.findOne({name: 'setupObject', id_coll: 'diSetup'});
	const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
	const lista = { tag_list: [{"tag": "", "valore": "test valore"}] };
	return request(app)
        .patch('/api/v1/objects/' + id._id)
        .set('token', token)
        .set('content-type', 'application/json')
        .send(lista)
        .expect(400, {success: false, message: "I campi tag non possono essere vuoti."});
});

/* incompleto
test('PATCH /api/v1/objects/:objectId immagine e tag inseriti', async() => {
	const id = await Obj.findOne({name: 'ObjectTest1', id_coll: '5fc7ee8a2b95d70adc1a7ffb'});
	const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
	const lista = "[{\"tag\": \"test tag\", \"valore\": \"test valore\"}]";

	return request(app)
        .patch('/api/v1/objects/' + id._id)
		.set('token', token)
        .set('content-type', 'application/json')
		.send({tag_list: lista, objectImage: binImage})
	    .expect(201, {success: true, message: "Oggetto aggiornato con successo."});
});
*/
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

test("DELETE /api/v1/objects L'id delle oggetto fornito è correto ma non esiste sul db", () => {
    const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
    return request(app)
        .delete('/api/v1/objects')
        .set('token', token)
        .set('content-type', 'application/json')
        .send({id_obj: '1aa1aa1a1a11a11aaa1a1aaa'})
        .expect(404, {success: false, message: 'Non esiste un oggetto con tale id.'});
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

test('DELETE/:id_obj Tag eliminato correttamente', async () =>{
	const id = await Obj.findOne({name: 'ObjectTest1', id_coll: '5fc7ee8a2b95d70adc1a7ffb'});
	const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
	return request(app)
        .delete('/api/v1/objects/' + id._id)
		.set('token', token)
        .set('content-type', 'application/json')
        .send({id_tag: id.tag_list[0]._id})
        .expect(200, {success: true, message: "Tag eliminato."});
});

test('DELETE/:id_obj Campo id_tag non fornito', async () =>{
	const id = await Obj.findOne({name: 'ObjectTest1', id_coll: '5fc7ee8a2b95d70adc1a7ffb'});
	const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
	return request(app)
        .delete('/api/v1/objects/' + id._id)
		.set('token', token)
        .set('content-type', 'application/json')
        .expect(400, {success: false, message: "id_tag mancante."});
});

test('DELETE/:id_obj Campo id_tag non corretto', async () =>{
	const id = await Obj.findOne({name: 'ObjectTest1', id_coll: '5fc7ee8a2b95d70adc1a7ffb'});
	const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
	return request(app)
        .delete('/api/v1/objects/' + id._id)
		.set('token', token)
        .set('content-type', 'application/json')
        .send({id_tag: 'palesementeerrato'})
        .expect(400, {success: false, message: "id_tag errato."});
});

test('DELETE/:id_obj Campo id_obj non corretto', async () =>{
	const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
	return request(app)
        .delete('/api/v1/objects/palesementeerrato')
		.set('token', token)
        .set('content-type', 'application/json')
        .send({id_tag: '1aa1a1a1a1111a1aa1a1aa11'})
        .expect(400, {success: false, message: "id_obj errato."});
});

test('DELETE/:id_obj Campo id_obj corretto ma non esistente', async () =>{
	const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
	return request(app)
        .delete('/api/v1/objects/1aa1aaaa1a11a11aaa1a1aaa')
		.set('token', token)
        .set('content-type', 'application/json')
        .send({id_tag: '1aa1a1a1a1111a1aa1a1aa11'})
        .expect(404, {success: false, message: "Non esiste un oggetto con tale id."});
});

test("DELETE/:id_obj Campo id_tag corretto ma non presente nell'oggetto", async () =>{
	const id = await Obj.findOne({name: 'ObjectTest1', id_coll: '5fc7ee8a2b95d70adc1a7ffb'});
	const token = jwt.sign({email: 'test@test.it'}, process.env.SUPER_SECRET, { expiresIn: 10 });
	return request(app)
        .delete('/api/v1/objects/' + id._id)
		.set('token', token)
        .set('content-type', 'application/json')
        .send({id_tag: '1aa1a1a1a1111a1aa1a1aa11'})
        .expect(404, {success: false, message: "Non esiste un tag con tale id."});
});
