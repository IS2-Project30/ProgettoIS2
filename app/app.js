const express = require('express');
const app = express();

//Import Routes
const authentication = require('./authentication.js');
const signup = require("./signup.js");
const collections = require('./collections.js');
const tokenChecker = require('./tokenChecker.js');

//Rutes Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', express.static('static'));

app.use("/signup", signup);
app.use('/authentication', authentication);
app.use('/collections', tokenChecker, collections);

app.use((req, res) => {
    res.status(404);
    res.json({success: false, message: 'Non trovato'});
});


module.exports = app;
