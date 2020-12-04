const express = require('express');
const ObjectID = require ('mongodb').ObjectID
const Collection = require('../models/Collection');
const Object = require('../models/Object');
const router = express.Router();

// Ottieni tutti gli oggetti associati ad una collezione, id_coll passato tramite query
router.get('/', async function(req, res){

    if(!req.query.id_coll){
        res.status(400).json({success: false, message: "Campo id_coll non fornito."});
        return;
    }

    try{
        var obj = await Object.find({id_coll: req.query.id_coll});
        var coll = await Collection.find({_id: req.query.id_coll});
    } catch(err){
        res.status(500).json({success: false, message: "Errore ricerca sul db."});
        return;
    }
    /*
    if(!(obj !== undefined && obj.length > 0)){
        res.status(200).json({success: true, message: "Non ci sono oggetti"});
        return;
    }
    */
    console.log("Lista oggetti: " + obj); // Stampa di controllo

    //res.status(200).json({success: true, objects: obj});
    res.render('pages/objects', {
        nome_coll: coll[0].name,
        token: req.query.token,
        obj: obj
    })
});

// Creare un oggetto per una collezione
router.post('/', async function(req, res){

    // Controllo se è stato inserito un nome valido per la collezione
    if(!req.body.name || !(req.body.name.length >= 2 && req.body.name.length < 255)){
        res.status(400).json({success: false, message: "Nome non valido."});
        return;
    }

    // Controllo se è stato inserito l'id della collezione a cui aggiungere l'oggetto
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

    // Controllo se la collezione esiste, findOne perché id unico
    try{
        var coll = await Collection.findOne({_id: id_coll});
    } catch(err){
        res.status(500).json({success: false, message: "Errore ricerca sul db."});
        return;
    }

    // Non è stata trovata alcuna collezione
    if(!coll){
        res.status(404).json({success: false, message: "Non esiste una collezione con tale id."});
        return;
    }

    // Creo l'oggetto da salvare, AGGINGERE tag_list
    const obj = new Object({
        name: req.body.name,
        id_coll: req.body.id_coll
    });

    // Salvo l'oggetto sul db
    try{
        obj.save();
        console.log('Oggetto ' + JSON.stringify(obj) + ' salvato'); // Stampa di controllo
        res.status(201).json({success: true, message: "Oggetto creato."});
    } catch(err){
        console.log("Errore salvataggio dell'oggetto"); // Stampa di controllo
        res.status(500).json({success: false, message: "Errore salvataggio dell'oggetto"});
    }

});

module.exports = router;
