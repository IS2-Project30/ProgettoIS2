const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const User = require('./app/models/User');
const Collection = require('./app/models/Collection');
const Obj = require('./app/models/Object');

mongoose.connect(process.env.DB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
	}
);

/*
	Cancella tutti i dati nel database ad eccezione di quelli utilizzati per i test
*/
const setup = async function(){
	try{
		const resultUser = await User.deleteMany({name: {$ne: "NomeTest"}});
		const resultCollection = await Collection.deleteMany({name: {$nin: ["CollezioneTest1", "CollezioneTest2"]}});
		const resultObject = await Obj.deleteMany({name: {$nin: ["ObjectTest1", "ObjectTest2"]}});
		console.log("ok: " + resultUser.ok + ", " + resultCollection.ok + ", " + resultObject.ok);
		console.log("n: " + resultUser.n + ", " + resultCollection.n + ", " + resultObject.n);
		console.log("deletedCount: " + resultUser.deletedCount + ", " + resultCollection.deletedCount + ", " + resultObject.deletedCount);
	} catch(err){
		console.log(err);
	}

	bcrypt.hash('123456', 10, (err, hash) => {

		const diego = new User({
			name: 'Diego',
			email: 'diego@gmail.com',
			password: hash
		});

		const manuel = new User({
			name: 'Manuel',
			email: 'manuel@gmail.com',
			password: hash
		});

		const marco = new User({
			name: 'Marco',
			email: 'marco@gmail.com',
			password: hash
		});

		const collezione1 = new Collection({
			name: 'setupCollezione',
			email: 'marco@gmail.com'
		});

		const oggetto1 = new Obj({
			name: 'setupObject',
			id_coll: 'diSetup'
		});

		try{
			diego.save();
			marco.save();
			manuel.save();
			collezione1.save();
			oggetto1.save();
			console.log('Utenti, collezioni e oggetti salvati correttamente');
		}catch(err){
			console.log(err);
			console.log('Errore nel salvataggio.');
		}
	});

	console.log("!!! Chiudere con ^C !!!");
	//process.exit() // Enigma, non si riesce in nessun modo a permettere il salvataggio sul db dei dati. Chiudere con ^C
}

setup();
