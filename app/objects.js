const express = require('express');
const ObjectID = require ('mongodb').ObjectID;
const Collection = require('./models/Collection');
const Obj = require('./models/Object');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');

const storage = multer.diskStorage({
	//property destination, dove i file verrano salvati
	destination: function(req, file, callback){
		callback(null, "./uploads");
	},
	//property filename, come i file verranno rinominati
	filename: function(req, file, callback){
		callback(null, new Date().toISOString() + file.originalname);
	}
});

const fileFilter = (req, file, callback) => {
	if( file.mimetype === "image/jpeg" ||
		file.mimetype === "image/png" ||
		file.mimetype === "image/gif"){
		//accept a file, lo salva
		callback(null, true);
	}else{
		//reject a file, lo ignora
		callback( {
			success: false,
			message: "Errore formato immagine non supportato."},false
		);
	}
};

const upload = multer( {
	storage: storage,
	limits: {
		fileSize: 1024 * 1024
	},
	fileFilter: fileFilter
});

// Ottieni tutti gli oggetti associati ad una collezione, id_coll passato tramite query
router.get('/', async function(req, res){

    // Controllo che sia fornito un id_coll
    if(!req.query.id_coll){
        res.status(400).json({success: false, message: "Campo id_coll non fornito."});
        return;
    }

    // Cerco tutti gli oggetti appartenenti alla collezione identificata dal campo id_coll
    try{
        var obj = await Obj.find({id_coll: req.query.id_coll});
        var coll = await Collection.findOne({_id: req.query.id_coll});
    } catch(err){
        res.status(500).json({success: false, message: "Errore ricerca sul db."});
        return;
    }

	//collezione non trovata
	if(coll == null){
		res.status(404).json({success: false, message: "Campo id_coll non valido."});
		return;
	}

/*
    // Sa le ricerca non ha restituito alcun oggetto
    if(!(obj !== undefined && obj.length > 0)){
        res.status(200).json({success: true, message: "Non ci sono oggetti."});
        return;
    }
*/

    console.log("Lista oggetti: " + obj); // Stampa di controllo

    console.log("Coll : " + coll)

    res.status(200).json({success: true, objects: obj, coll_name: coll.name});
});

// Creare un oggetto per una collezione
router.post('/', async function(req, res){

    // Controllo se è stato inserito un nome valido per la collezione
    if(!req.body.obj.name || !(req.body.obj.name.length >= 2 && req.body.obj.name.length < 255)){
        res.status(400).json({success: false, message: "Nome non valido."});
        return;
    }

    // Controllo se è stato inserito l'id della collezione a cui aggiungere l'oggetto
    if(!req.body.obj.id_coll){
        res.status(400).json({success: false, message: "id_coll mancante."});
        return;
    }

    // Converto la stringa id_coll in oggetto ObjectID
    try{
        var id_coll = ObjectID.createFromHexString(req.body.obj.id_coll);
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

    // Creo l'oggetto da salvare
    const obj = new Obj({
        name: req.body.obj.name,
        id_coll: req.body.obj.id_coll,
        tag_list:[]
    });

    // Salvo l'oggetto sul db
    try{
        obj.save();
        console.log('Oggetto ' + JSON.stringify(obj) + ' salvato'); // Stampa di controllo
        res.status(201).json({success: true, message: "Oggetto creato.", id_obj: obj._id});
    } catch(err){
        console.log("Errore salvataggio dell'oggetto"); // Stampa di controllo
        res.status(500).json({success: false, message: "Errore salvataggio dell'oggetto"});
    }

});

// Eliminare un oggetto
router.delete('/', async function(req, res) {

    // Controllo se è stato inserito l'id dell'oggetto
    if(!req.body.id_obj){
        res.status(400).json({success: false, message: "id_obj mancante."});
        return;
    }

    // Converto la stringa id_obj in oggetto ObjectID
    try{
        var id_obj = ObjectID.createFromHexString(req.body.id_obj);
    } catch(err){
        res.status(400).json({success: false, message: "id_obj errato."});
        return;
    }

    // Controllo che esista l'oggetto identificato da id_obj
    try{
        var oggetto = await Obj.findOne({_id: id_obj});
    } catch(err){
        res.status(500).json({success: false, message: "Errore ricerca sul db."});
        return;
    }

    // Se l'oggetto che non esiste
    if(!oggetto){
        res.status(404).json({success: false, message: "Non esiste un oggetto con tale id."});
        return;
    }

	//se vi è un immagine associata all'oggetto
	if( typeof(oggetto.objectImage) != "undefined"){

		//cancellazione immagine dal server
		fs.unlink(oggetto.objectImage, function(err){
			if( err){
				res.status(500).json({success: false, message: "Errore cancellazione immagine."});
				return;
			}
		});

		//cancellazione oggetto
		try{
	        await Obj.deleteOne({_id: id_obj});
	        console.log('Oggetto id: ' + req.body.id_obj + ' eliminato.'); // Stampa di controllo
	        res.status(200).json({success: true, message: "Oggetto eliminato."});
			return;
		} catch(err){
	        res.status(500).json({success: false, message: "Errore sul db."});
			return;
		}

	}else{	//se non vi è un immagine cancello solo l'oggetto

		try{
	        await Obj.deleteOne({_id: id_obj});
	        console.log('Oggetto id: ' + req.body.id_obj + ' eliminato.'); // Stampa di controllo
	        res.status(200).json({success: true, message: "Oggetto eliminato."});
			return;
		} catch(err){
	        res.status(500).json({success: false, message: "Errore sul db."});
			return;
		}
	}

});

// Elimina un tag dall'oggetto indicato, richiede id_tag
router.delete('/:id_obj', async function(req, res){

    // Controllo se è stato inserito l'id del tag
    if(!req.body.id_tag){
        res.status(400).json({success: false, message: "id_tag mancante."});
        return;
    }

	// Converto la stringa id_tag in oggetto ObjectID
    try{
        var id_tag = ObjectID.createFromHexString(req.body.id_tag);
    } catch(err){
        res.status(400).json({success: false, message: "id_tag errato."});
        return;
    }

	// Converto la stringa id_obj in oggetto ObjectID
    try{
        var id_obj = ObjectID.createFromHexString(req.params.id_obj);
    } catch(err){
        res.status(400).json({success: false, message: "id_obj errato."});
        return;
    }

	// Controolo che l'oggetto indicato esista
    try{
        var oggetto = await Obj.findOne({_id: id_obj});
    } catch(err){
        res.status(500).json({success: false, message: "Errore ricerca sul db."});
        return;
    }
    // Se l'oggetto che non esiste
    if(!oggetto){
        res.status(404).json({success: false, message: "Non esiste un oggetto con tale id."});
        return;
    }

    // Controllo che esista il tag nell'oggetto
	let exist = false;
	for(i=0; i<oggetto.tag_list.length; ++i){
		if(oggetto.tag_list[i]._id == req.body.id_tag){
			exist = true;
			break;
		}
	}
	if(!exist){
        res.status(404).json({success: false, message: "Non esiste un tag con tale id."});
        return;
	}

    try{
        var result = await Obj.update({_id: id_obj}, { $pull: {tag_list: {_id: req.body.id_tag}}});
        console.log("Tag id: " + req.body.id_tag + " eliminato.");
        res.status(200).json({success: true, message: "Tag eliminato."});
    } catch(err){
        res.status(500).json({success: false, message: "Errore sul db."});
    }

});

/*	Formato tag_list in msg http per patch object
	{
		tag_list: [
			{"tag": "nometag", "value": "valoretag"},
			{"tag": "nometag2", "value": "valoretag2"},
			{"hfuasho"}
		],
		"token": "valore token"
	}
*/
//modifica di un Oggetto, aggiunta delle tags e/o immagine
router.patch('/:objectId', upload.single("objectImage"), async function(req, res){
	var req_tag_list = req.body.tag_list;
	var objectId;
	var oggetto;
	var image = "";
	var nuoviTags = [];

	//se la lista viene passata come stringa la converto in oggetto
	if( typeof(req_tag_list) == "string"){
		try{
			req_tag_list = JSON.parse(req_tag_list);
		}catch(err){
			res.status(400).json({success: false, message: "Non esiste tag_list o vi son errori di sintassi."});
	        return;
		}
	}

	//tag_list non valida
	if( !req_tag_list){
		res.status(400).json({success: false, message: "Non esiste tag_list o vi son errori di sintassi."});
        return;
	}

	// Converto la stringa objectId in oggetto ObjectID
    try{
        objectId = ObjectID.createFromHexString(req.params.objectId);
    } catch(err){
        res.status(400).json({success: false, message: "objectId errato."});
        return;
    }

	//ricerca nel db dell'oggetto indicato
	try{
        oggetto = await Obj.findById(objectId).exec();
    } catch(err){
        res.status(500).json({success: false, message: "Errore ricerca sul db."});
        return;
    }

	//se ricercato un oggetto che non esiste
	if( !oggetto){
		res.status(404).json({success: false, message: "Non esiste un oggetto con tale id."});
        return;
	}

	//creazione lista di oggetti conformi al modello e controllo tag
	for( i=0; i<req_tag_list.length; i++){

		//se è presente il campo "tag"
		if( req_tag_list[i].hasOwnProperty("tag")){

			//se il campo tag è nullo o vuoto restituisco un errore
			if( !req_tag_list[i]["tag"] || req_tag_list[i]["tag"] === ""){
				res.status(400).json({success: false, message: "I campi tag non possono essere vuoti."});
				return;

			}else{	//se tag non è nullo o vuoto
				//controllo il campo value che è comunque facoltativo
				if( req_tag_list[i].hasOwnProperty("value")){
					nuoviTags[i] = {
						"tag": req_tag_list[i].tag,
						"value": req_tag_list[i].value
					}
				}else{
					nuoviTags[i] = {
						"tag": req_tag_list[i].tag
					}
				}
			}
		}
	}

	// applicazione modifiche
	//se è presente un file
	if( req.file){
		image = req.file.path;

		//applicazione modifiche con immagine
		try{
			await Obj.findOneAndUpdate( {_id: objectId}, {
				$push: {tag_list: nuoviTags}, objectImage: image }, {
				new: true
			});
		}catch(err){
			res.status(500).json({success: false, message: "Errore update sul db."});
	        return;
		}

	}else{
		//applicazione modifiche senza immagine
		try{
			await Obj.findOneAndUpdate( {_id: objectId}, {
				$push: {tag_list: nuoviTags} }, {
				new: true
			});
		}catch(err){
			res.status(500).json({success: false, message: "Errore update sul db."});
	        return;
		}
	}

	res.status(201).json({success: true, message: "Oggetto aggiornato con successo."});
});

module.exports = router;
