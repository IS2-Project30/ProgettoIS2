var mongoose = require('mongoose');
var User = require('./app/models/User');
var Collection = require('./app/models/Collection');

mongoose.connect(process.env.DB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
	}
);

/*
	Cancella tutti gli users presenti nel database e inserisce 3 utenti nuovi
*/
const setup = async function(){
	try{
		const result1 = await User.deleteMany();
		const result2 = await Collection.deleteMany();
		console.log("ok:" + result1.ok + ', ' + result2.ok);
		console.log("n" + result1.n + ', ' + result2.n);
		console.log("deletedCount:" + result1.deletedCount + ', ' + result2.deletedCount);
	}catch(err){
		console.log(err);
	}

	const diego = new User({
		name: 'Diego',
		email: 'diego@gmail.com',
		password: '123456'
	});

	const manuel = new User({
		name: 'Manuel',
		email: 'manuel@gmail.com',
		password: '345678'
	});

	const marco = new User({
		name: 'Marco',
		email: 'marco@gmail.com',
		password: '987654'
	});


	const collezione1 = new Collection({
		name: 'testCollezione',
		email: 'marco@gmail.com'
	});

	try{
		diego.save();
		marco.save();
		manuel.save();

		collezione1.save();

		console.log('Utenti salvati correttamente');
	}catch(err){
		console.log('Errore nel salvataggio dei utenti.');
	}
}

setup();
