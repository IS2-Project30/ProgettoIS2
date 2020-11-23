const express = require('express');
const Collection = require('./models/Collection');
const router = express.Router();

router.get('/', async function(req, res) {

    try{
        var coll = await Collection.find({email: req.body.email});
    } catch(err){
        res.status(500).json("Errore ricerca sul db.");
        return;
    }

    if(!coll){
        res.status(404).json("Non esistono collezioni.");
        return;
    }

    var collezioni = coll.map((x) => {return x.name});

    console.log(collezioni); // Stampa di prova
    res.status(200).json(collezioni);

});

router.post('/', async function(req, res) {

    try{
        var coll = await Collection.findOne({name: req.body.name, email: req.body.email}).exec();
    } catch(err){
        console.log("Errore ricerca collezione");
        res.status(500).json({success: false, message: "Errore ricerca sul db."});
        return;
    }

    // Una collezione con questo nome esiste già
    if(coll){
        res.status(409).json({success: false, message: "Una collezione con questo nome esiste già"});
        return;
    }

    const collezione = new Collection({
        name: req.body.name,
        email: req.body.email
    });

    try{
        collezione.save();
        console.log('Collezione salvata'); // Stampa di controllo
        res.status(200).json({success: true, message: "Collezione creata"});
    } catch(err){
        console.log('Errore nel salvataggio della collezione');
        res.status(500).json({success: false, message: "Errore salvataggio sul db"});
    }

});

module.exports = router;
