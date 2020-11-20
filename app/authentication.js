const express = require('express');
var mongoose = require('mongoose');
var User = require('./models/User');
const router = express.Router();

var cerca = async function(email, pass){
    var res;
    try{
        res = await User.find({email: email, password: pass}).exec();
    } catch(err){
        console.log('Errore find');
    }

    console.log(res);

    if(res.length){
        //return 0;
        console.log('Trovato');
    } else {
        //return 1;
        console.log('Non trovato');
    }

}

router.post('/', async function(req, res){

    mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true });

    cerca(req.body.email, req.body.password);
/*  
    if(cerca(req.body.email, req.body.password)){
        console.log('Trovato');
    } else {
        console.log('Non trovato');
    }
*/

    console.log(req.body.email + " " + req.body.password);

});

router.get('/', function(req, res){ 
    console.log("email arrivata.");
});

module.exports = router;
