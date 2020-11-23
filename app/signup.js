const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");


router.post("/", (req, res, next) => {
	//Cerca nel db l'email specificata nella request
	User.find({ email:req.body.email}).exec().then( user => {
		//se viene trovata una o più email, significa che è già utilizzata
		if( user.length >= 1){

			return res.status(409).json({
				message: "email esistente"
			});

		}else{
			console.log("encrypt");
			//email non trovata, allora è possibile registrarsi
			//si effettua la criptazione della password
			bcrypt.hash(req.body.password, 10, (err, hash) => {
				//se è avvenuto un errore durante la criptazione, response con error
				if(err){
					return res.status(500).json({
						error: err
					});
				}else{
					//altrimenti viene creto il nuovo utente
					const newUser = new User({
						_id: mongoose.Types.ObjectId(),
						name: req.body.name,
						email: req.body.email,
						password: hash		//hash password cifrata
					});

					newUser.save().then( result => {
						console.log( result)
						res.status(201).json({
							message: "utente creato"
						});
					}).catch( err => {
						console.log( err);
						res.status(500).json({
							error: err
						});
					});
				};
			});

		}
	}).catch();
});







module.exports = router;







//
