var mongoose = require('mongoose');
var User = require('./app/models/User');

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
		const result = await User.deleteMany();
		console.log("ok:" + result.ok);
		console.log("n" + result.n);
		console.log("deletedCount:" + result.deletedCount);
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
		email: 'Marco@gmail.com',
		password: '987654'
	});

	try{
		diego.save();
		marco.save();
		manuel.save();

		console.log('Utenti salvati correttamente');
	}catch(err){
		console.log('Errore nel salvataggio dei utenti.');
	}
}

setup();
