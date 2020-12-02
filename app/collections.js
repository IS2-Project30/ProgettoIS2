const express = require('express');
const ObjectID = require ('mongodb').ObjectID;
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

    if(!(coll !== undefined && coll.length > 0)){
        res.status(200).json({success: true, message: "Non esistono collezioni."});
        return;
    }

    var collezioni = coll.map((x) => {return {name: x.name, id_coll: x.id}});

    console.log("Collezioni tovate: " + JSON.stringify(collezioni)); // Stampa di prova
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
        console.log('Collezione salvata' + JSON.stringify(collezione)); // Stampa di controllo
        res.status(201).json({success: true, message: "Collezione creata."});
    } catch(err){
        console.log('Errore nel salvataggio della collezione');
        res.status(500).json({success: false, message: "Errore salvataggio sul db"});
    }

});

// Eliminare una collezione
router.delete('/', async function(req, res) {

    // Controllo se è stato inserito l'id della collezione
    if(!req.body.id_coll){
        res.status(400).json({success: false, message: "id_coll mancante."});
        return;
    }

    // Converto la stringa id_coll in oggetto ObjectID
    try{
        var id_coll = ObjectID.createFromHexString(req.body.id_coll);
    } catch(err){
        res.status(400).json({success: false, message: "id_coll errato."});
        return;
    }

    try{
        await Collection.deleteOne({_id: id_coll});
        console.log('Collezione id: ' + req.body.id_coll + ' eliminata'); // Stampa di controllo
        res.status(200).json({success: true, message: "Collezione eliminata."});
    } catch(err){
        res.status(500).json({success: false, message: "Errore sul db."});
    }

});

module.exports = router;
