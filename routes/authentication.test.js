const request = require('supertest');
const app = require('./app');
const User = require('./models/User');
const mongoose = require('mongoose');

let connection;

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

test('POST /api/v1/authentication Utente non trovato', () => {
    let user = {email: 'nonesiste@nonmail.com', password: 'nonesiste'};
    return request(app)
       .post('/api/v1/authentication')
       .set('content-type', 'application/json')
       .send(user)
       .expect(401, {success: false, message: 'Autenticazione fallita. Utente non trovato.'});
});

test('POST /api/v1/authentication Password non corretta', () => {
    let user = {email: 'marco@gmail.com', password: 'nonesiste'};
    return request(app)
       .post('/api/v1/authentication')
       .set('content-type', 'application/json')
       .send(user)
       .expect(401, {success: false, message: 'Autenticazione fallita'});
});

test("POST /api/v1/authentication Email corta", () => {
	let user = {email: '', password: 'nonesiste'};
	return request(app)
		.post('/api/v1/authentication')
		.set('Accept', 'application/json')
		.send(user)	//json nel body
		.expect(400, {
			success: false,
			message: "Email scorretta."
		});
});

test("POST /api/v1/authentication Lunghezza password minore di 6 caratteri", () => {
	let user = {email: 'marco@gmail.com', password: ''};
	return request(app)
		.post('/api/v1/authentication')
		.set('Accept', 'application/json')
		.send(user)	//json nel body
		.expect(400, {
			success: false,
			message: "Password scorretta."
		});
});

//Autenticazione riuscita, ovviamente il successo di questo test dipende dal fatto che l'utente sia già presente sul db
test('POST /api/v1/authentication Autentucazione avvenuta', () => {
    let user = {email: 'marco@gmail.com', password: '987654'};
    return request(app)
       .post('/api/v1/authentication')
       .set('content-type', 'application/json')
       .send(user)
       .expect(200);
});

