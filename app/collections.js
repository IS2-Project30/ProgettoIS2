const express = require('express');
const ObjectID = require ('mongodb').ObjectID;
const Collection = require('./models/Collection');
const User = require('./models/User');
const Obj = require('./models/Object');
const router = express.Router();

// ottieni tutte le collezioni associate ad un email
router.get('/', async function(req, res) {

    try{
        var coll = await Collection.find({email: req.loggedUser.email});
        var user = await User.find({email: req.loggedUser.email});
    } catch(err){
        res.status(500).json({success: false, message: "Errore ricerca sul db."});
        return;
    }
/*
    if(!(coll !== undefined && coll.length > 0)){
        res.status(200).json({success: true, message: "Non esistono collezioni."});
        return;
    }
*/
    var collezioni = coll.map((x) => {return {name: x.name, id_coll: x.id}});

    console.log("Collezioni tovate: " + JSON.stringify(collezioni)); // Stampa di prova
    res.status(200).json({success: true, collections: collezioni, user: user});

});

//crea collezione associata ad un email
router.post('/', async function(req, res) {

    console.log(req.body.coll.name);
    console.log(req.body.coll.email);

    if(!req.body.coll.name || !(req.body.coll.name.length >= 6 && req.body.coll.name.length < 255)){
        res.status(400).json({success: false, message: "Nome non valido."});
        return;
    }

    try{
        var coll = await Collection.findOne({name: req.body.coll.name, email: req.loggedUser.email}).exec();
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
        name: req.body.coll.name,
        email: req.loggedUser.email
    });

    try{
        collezione.save();
        console.log('Collezione salvata' + JSON.stringify(collezione)); // Stampa di controllo
        res.status(201).json({success: true, message: "Collezione creata.", id_coll: collezione._id});
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

    // Eliminazione della collezione
    try{
        await Obj.deleteMany({id_coll: req.body.id_coll}); // Eliminazione di tutti gli oggetti appartenenti alla collezione
        await Collection.deleteOne({_id: id_coll}); // Eliminazione della collezione
        console.log('Collezione id: ' + req.body.id_coll + ' eliminata'); // Stampa di controllo
        res.status(200).json({success: true, message: "Collezione eliminata."});
    } catch(err){
        res.status(500).json({success: false, message: "Errore sul db."});
    }

});

router.patch('/:collId',  async function(req, res){
 
    var collId;
    var collezione;
    
    //nuovoNome non valido
	if( !req.body.nuovoNome){
		res.status(400).json({success: false, message: "Non esiste un nuovo nome."});
        return;
	}
    
    // Converto la stringa collectId in oggetto ObjectID
    try{
        collId = ObjectID.createFromHexString(req.params.collId);
    } catch(err){
        res.status(400).json({success: false, message: "collId errato."});
        return;
    }

    //ricerca nel db dell'oggetto indicato
	try{
        collezione = await Collection.findById(collId).exec();
    } catch(err){
        res.status(500).json({success: false, message: "Errore ricerca sul db."});
        return;
    }

    //se ricercato un oggetto che non esiste
	if( !collezione){
		res.status(404).json({success: false, message: "Non esiste una collezione con tale id."});
        return;
    }
    
    var query = {'_id': collezione._id};
    //applicazione modifiche della collezione
    try{
        await Collection.findOneAndUpdate( query,
        {name: req.body.nuovoNome});
    }catch(err){
        res.status(500).json({success: false, message: "Errore update sul db."});
        return;
    }
    res.status(201).json({success: true, message: "Collezione aggiornata con successo."});
});

module.exports = router;
