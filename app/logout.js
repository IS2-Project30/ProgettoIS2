const express = require('express');
const router = express.Router();
const Blacklist = require('./models/Blacklist');

router.post('/', async function(req, res){

    // Controllo se esiste un token, non dovrebbe mai accadere in quanto il controllo viene effettuato anche in tokenChecker
    var token = req.body.token || req.query.token || req.headers['token'];
    // Se non trovo alcun token
    if(!token){
        return res.status(401).send({success: false, message: 'Nessun token fornito.'});
    }
    // Calcolo data scadenza token exp*1000
    var daInserire = new Blacklist({
        expireAt: parseInt(req.loggedUser.exp)*1000,
        token: token
    });

    try{
        await daInserire.save();
        // console.log("Inserito in blacklist."); // Stampa di controllo
        return res.status(200).json({success: true, message: "Logout corretto."});
    } catch(err){
        // console.log("Errore sul db."); // Stampa di controllo
        return res.status(500).json({success: false, message: "Errore di logout."});
    }

});

module.exports = router;
