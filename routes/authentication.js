const express = require('express');
const User = require('../models/User');
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require('jsonwebtoken');

//GET login
router.get('/', async function(req, res){
    res.render('pages/login');
});

//POST effettua login con email e password di un utente registrato
router.post('/', async function(req, res){

    if(!req.body.password || !(req.body.password.length >= 6 && req.body.password.length < 1024)){
        //password di lunghezza non valida
        return res.status(400).json({
            success: false,
            message: "Password scorretta."
        });

    }

    if(!req.body.email || !(req.body.email.length >= 6 && req.body.email.length < 255)){
        //email di lunghezza non valida
        return res.status(400).json({
            success: false,
            message: "Email scorretta."
        });
    }

    try{
        var user = await User.findOne({email: req.body.email}).exec();
    } catch(err){
        console.log("Errore autenticazione");
        res.status(500).json({success: false, message: "Errore sul db."});
        return;
    }

    //console.log(user); // Stampa controllo risposta db

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
                message: "Autenticazione riuscita",
                    token: token,
                    name: user.name
            });
        }
        //altrimenti autenticazione non avvenuta
        res.status(401).json({
            success: false,
            message:"Autenticazione fallita"
        });
    });
});

module.exports = router;
