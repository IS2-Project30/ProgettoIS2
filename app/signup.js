const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

//iscrizione nuovo utente
router.post("/", (req, res, next) => {
	//Cerca nel db l'email specificata nella request
	User.find({ email:req.body.email}).exec().then( user => {
		//se viene trovata una o più email, significa che è già utilizzata
		if( user.length >= 1){

			return res.status(409).json({
				success: false,
				message: "Email già registrata"
			});

		}else{

			//email non trovata, allora è possibile registrarsi
			//si effettua la criptazione della password
			bcrypt.hash(req.body.password, 10, (err, hash) => {
				//se è avvenuto un errore durante la criptazione, response con error
				if(err){
					return res.status(500).json({
						success: false,
						message: "Errore:" + err
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
						console.log( result);
						res.status(201).json({
							success: true,
							message: "Utente creato"
						});
					}).catch( err => {
						console.log( err);
						res.status(500).json({
							success: false,
							message: "Errore:" + err
						});
					});
				};
			});

		}
	}).catch();
});



module.exports = router;
