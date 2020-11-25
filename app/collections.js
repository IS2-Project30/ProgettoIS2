const express = require('express');
const Collection = require('./models/Collection');
const router = express.Router();

// ottieni tutte le collezioni associate ad un email
router.get('/', async function(req, res) {

    try{
        var coll = await Collection.find({email: req.loggedUser.email});
    } catch(err){
        res.status(500).json({success: false, message: "Errore ricerca sul db."});
        return;
    }

    if(!(coll !== 'undefined' && coll.length > 0)){
        res.status(404).json({success: false, message: "Non esistono collezioni."});
        return;
    }

    var collezioni = coll.map((x) => {return x.name});

    console.log(collezioni); // Stampa di prova
    res.status(200).json({success: true, collections: collezioni});

});

//crea collezione associata ad un email
router.post('/', async function(req, res) {

    if(!req.body.name || !(req.body.name.length >= 6 && req.body.name.length < 255)){
        res.status(400).json({success: false, message: "Nome non valido."});
        return;
    }

    try{
        var coll = await Collection.findOne({name: req.body.name, email: req.loggedUser.email}).exec();
    } catch(err){
        console.log("Errore ricerca collezione");
        res.status(500).json({success: false, message: "Errore ricerca sul db."});
        return;
    }

    // Una collezione con questo nome esiste già
    if(coll){
        res.status(409).json({success: false, message: "Una collezione con questo nome esiste già."});
        return;
    }

    const collezione = new Collection({
        name: req.body.name,
        email: req.loggedUser.email
    });

    try{
        collezione.save();
        console.log('Collezione salvata'); // Stampa di controllo
        res.status(201).json({success: true, message: "Collezione creata."});
    } catch(err){
        console.log('Errore nel salvataggio della collezione');
        res.status(500).json({success: false, message: "Errore salvataggio sul db"});
    }

});

module.exports = router;
