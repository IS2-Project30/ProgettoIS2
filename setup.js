var User = require('./app/models/User');

var mongoose = require('mongoose');

console.log('1');

//Connect to database
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then( () => console.log('Connected to database.') )
.then( () => {
    
    //User.remove();

    console.log('2');

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
        var savedUser = diego.save();
        savedUser = marco.save();
        savedUser = manuel.save();
    }catch(err){
        console.log('Errore nel salvataggio dei utenti.');
    }
}).then( process.exit() );;

console.log('3');
/*
//Clear User
User.remove().then( () => {
    var diego = new User({
        name: 'Diego',
        email: 'diego@gmail.com',
        password: '123456'
    });
    return diego.save();
}).then( () => {
    console.log('User diego salvato correttamente')
}).then( () => {
    var marco = new User({
        name: 'Marco',
        email: 'marco@gmail.com',
        password: '987654'
    });
    return marco.save();
}).then( () => {
    console.log('User marco salvato correttamente')
}).then( () => {
    var manuel = new User({
        name: 'Manuel',
        email: 'manuel@gmail.com',
        password: '345678'
    });
    return manuel.save();
}).then( () => {
    console.log('User manuel salvato correttamente')
}).then( process.exit() );
*/