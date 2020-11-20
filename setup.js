var mongoose = require('mongoose');

var User = require('./app/models/User');

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then ( () => {
        console.log("Connected to Database.");
}).then( User.remove() )
.then( () => {
    console.log("Allinterno then");

    var diego = new User({
        name: 'Diego',
        email: 'diego@gmail.com',
        password: '123456'
    });

    var marco = new User({
        name: 'Marco',
        email: 'marco@gmail.com',
        password: '987654'
    });
    var manuel = new User({
        name: 'Manuel',
        email: 'manuel@gmail.com',
        password: '345678'
    });
    try{
        diego.save();
        marco.save();
        manuel.save();
        console.log('Utenti salvati correttamente');
    }catch(err){
        console.log('Errore nel salvataggio dei utenti.');
    }
});
