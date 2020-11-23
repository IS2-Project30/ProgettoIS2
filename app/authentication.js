const express = require('express');
const User = require('./models/User');
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/', async function(req, res){

    try{
        var user = await User.findOne({email: req.body.email}).exec();
    } catch(err){
        console.log("Errore authentication");
        res.status(500).json({success: false, message: "Errore sul db."});
        return;
    }

    console.log(user); // Stampa controllo risposta db

    // Utente non trovato
    if(!user){
        res.status(401).json({success: false, message: "Autenticazione fallita. Utente non trovato."});
        return;
    }

	// payload per creazione token
	var payload = {
		email: user.email
	}

	var options = {
        expiresIn: 86400 // Scade dopo 24 ore
    }

	bcrypt.compare( req.body.password, user.password, (err, result) => {
		//in caso di errore autenticazione fallita
		if(err){
			return res.status(401).json({
				success: false,
				message:"Autenticazione fallita"
			});
		}
		//in caso di successo autenticazione avvenuta
		if(result){
			const token = jwt.sign( payload, process.env.SUPER_SECRET, options);
			return res.status(200).json({
				success: true,
				message: "Autenticazione riuscita!",
				token: token,
				name: user.name
			});
		}
		//altrimenti autenticazione non avvenuta
		res.status(401).json({
			success: false,
			message:"Auth failed"
		});
	});
});

router.get('/', function(req, res){
    console.log("email arrivata.");
});

module.exports = router;
