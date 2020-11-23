const express = require('express');
const Collection = require('./models/Collection');
const router = express.Router();

router.get('/', async function(req, res) {

    try{
        var coll = await Collection.findOne({name: req.query.name, email: req.query.email}).exec();
    } catch(err){
        console.log("Errore ricerca collezione");
        res.status(500).json({success: false, message: "Errore ricerca sul db."});
        return;
    }

    // Una collezione con questo nome esiste già
    if(coll){
        res.status(400).json({success: false, message: "Una collezione con questo nome esiste già"});
        return;
    }

    const collezione = new Collection({
        name: req.query.name,
        email: req.query.email
    });

    try{
        collezione.save();
        console.log('Collezione salvata');
    } catch(err){
        console.log('Errore nel salvataggio della collezione');
    }

});

module.exports = router;
