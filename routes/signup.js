const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//GET register
router.get('/', async function (req, res){
    res.render('pages/registrazione');
});

//POST iscrizione nuovo utente
router.post("/", async function (req, res) {

	if(!req.body.password || !(req.body.password.length >= 6 && req.body.password.length < 1024)){
		//password di lunghezza non valida
		return res.status(400).json({
			success: false,
			message: "Password troppo corta o troppo lunga."
		});

	}
	if(!req.body.name || !(req.body.name.length >= 4 && req.body.name.length < 255)){
		//nome di lunghezza non valida
		return res.status(400).json({
			success: false,
			message: "Nome troppo corto o troppo lungo."
		});
	}
	if(!req.body.email || !(req.body.email.length >= 6 && req.body.email.length < 255)){
		//email di lunghezza non valida
		return res.status(400).json({
			success: false,
			message: "Email troppo corta o troppo lunga."
		});
	}

	//Cerca nel db l'email specificata nella request
	User.find({ email:req.body.email}).exec().then( user => {
		//se viene trovata una o più email, significa che è già utilizzata
		if( user.length >= 1){

			return res.status(409).json({
				success: false,
				message: "Email già registrata"
			});

		}else {
			//email non trovata, allora è possibile registrarsi
			//si effettua la criptazione della password
			bcrypt.hash(req.body.password, 10, (err, hash) => {
				//se è avvenuto un errore durante la criptazione, response con error
				if(err){
					return res.status(500).json({
						success: false,
						message: err.message
					});
				}else{
					//altrimenti viene creato il nuovo utente
					const newUser = new User({
						_id: mongoose.Types.ObjectId(),
						name: req.body.name,
						email: req.body.email,
						password: hash		//hash password cifrata
					});

					newUser.save().then( result => {
						//console.log( result);
						res.status(201).json({
							success: true,
							message: "Utente creato"
						});
					}).catch( err => {
						res.status(400).json({
							success: false,
							message: err.message
						});
					});
				};
			});

		}
	}).catch();
});

module.exports = router;
