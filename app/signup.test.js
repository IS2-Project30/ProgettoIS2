const request = require('supertest');
const jwt     = require('jsonwebtoken');
//const app     = require('./app');
const User = require('./models/User');
const signup = require('./signup');
const mongoose = require('mongoose');

//--detectOpenHandles
var conn;

beforeAll( async () => {
	//jest.setTimeout(8000);
	//jest.unmock('mongoose');
	conn = await mongoose.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	console.log('Database connesso');
});

afterAll( () => {
	mongoose.connection.close();
	console.log("Connessione database chiusa");
});


test("POST /signup email già registrata", () => {
	const user = {email: "manuel@gmail.com", name: "manuel", password: "123456"};
	return request(signup)
		.post('/api/v1/signup')
		.set('Accept', 'application/json')
		.send(user)	//json nel body
		.expect(409, {
			success: false,
			message: "Email già registrata"
		});
});

test("POST /singup email non valida", () => {
	const user = {email: "manuelgmail.com", name: "manuel", password: "123456"};
	return request(signup)
		.post('/api/v1/signup')
		.set('Accept', 'application/json')
		.send(user)	//json nel body
		.expect(400, {
			success: false,
			message: "User validation failed: email: Path `email` is invalid (manuelgmail.com)."
		});
});

test("POST /singup nome non valido", () => {
	const user = {email: "manuel@gmail.com", name: "", password: "123456"};
	return request(signup)
		.post('/api/v1/signup')
		.set('Accept', 'application/json')
		.send(user)	//json nel body
		.expect(400, {
			success: false,
			message: "User validation failed: name: Path `name` is required."
		});
});

test("POST /singup lunghezza password minore di 6 caratteri", () => {
	const user = {email: "manuel@gmail.com", name: "manuel", password: ""};
	return request(signup)
		.post('/api/v1/signup')
		.set('Accept', 'application/json')
		.send(user)	//json nel body
		.expect(400, {
			success: false,
			message: "Password troppo corta o troppo lunga."
		});
});

test("POST /singup lunghezza password minore di 6 caratteri", () => {
	const user = {email: "manuel@gmail.com", name: "manuel", password: "gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg"};
	return request(signup)
		.post('/api/v1/signup')
		.set('Accept', 'application/json')
		.send(user)	//json nel body
		.expect(400, {
			success: false,
			message: "Password troppo corta o troppo lunga."
		});
});






/*
const respone = request(signup)
	.post('/signup')
	.set('Accept', 'application/json')
	.send(user);	//json nel body
expect(respone.statusCode).toBe(409);

*/


/*
	// Moking User.findOne method
	let userSpy;

	beforeAll( () => {
		const User = require('./models/User');
		userSpy = jest.spyOn(User, 'findOne').mockImplementation((criterias) => {
			return {
				email: 'manuel@mail.com'
			};
		});
	});

	afterAll(async () => {
		userSpy.mockRestore();
	});



	test('GET /signup with no token should return 401', async () => {
		const response = await request(app).get('/api/v1/students/me');
		expect(response.statusCode).toBe(401);
	});

	test('GET /api/v1/students/me?token=<invalid> should return 403', async () => {
		const response = await request(app).get('/api/v1/students/me?token=123456');
		expect(response.statusCode).toBe(403);
	});

	// create a valid token
	var payload = {
		email: 'John@mail.com'
	}
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}
	var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

	test('GET /api/v1/students/me?token=<valid> should return 200', async () => {
		expect.assertions(1);
		const response = await request(app).get('/api/v1/students/me?token='+token);
		expect(response.statusCode).toBe(200);
	});

	test('GET /api/v1/students/me?token=<valid> should return user information', async () => {
		expect.assertions(2);
		const response = await request(app).get('/api/v1/students/me?token='+token);
		const user = response.body;
		expect(user).toBeDefined();
		expect(user.email).toBe('John@mail.com');
	});
*/
