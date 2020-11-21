const express = require('express');
const User = require('./models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/', async function(req, res){

    try{
        var user = await User.findOne({email: req.body.email}).exec();
    } catch(err){
        console.log("Errore authentication");
        res.json({success: false, message: "Errore sul db."});
        return;
    }

    console.log(user); // Stampa controllo risposta db

    // Utente non trovato
    if(!user){
        res.json({success: false, message: "Autenticazione fallita. Utente non trovato."});
        return;
    }

    // Controllo password
    if(user.password != req.body.password){
        res.json({success: false, message: "Autenticazione fallita. Password errata."});
        return;
    }

    // payload per creazione token
    var payload = {
        email: user.email
    }

    var options = {
        expiresIn: 86400 // Scade dopo 24 ore
    }

    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

    res.json({
        success: true,
        message: 'Autenticazione riuscita!',
        token: token
    });

//    console.log(req.body.email + " " + req.body.password);

});

router.get('/', function(req, res){ 
    console.log("email arrivata.");
});

module.exports = router;

