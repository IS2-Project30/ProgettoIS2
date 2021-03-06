const express = require('express');
const app = express();

//Import Routes
const authentication = require('./authentication.js');
const signup = require("./signup.js");
const collections = require('./collections.js');
const tokenChecker = require('./tokenChecker.js');
const objects = require('./objects.js');
const logout = require('./logout.js');

//Rutes Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', express.static('static'));

app.use("/api/v1/signup", signup);
app.use('/api/v1/authentication', authentication);
app.use('/api/v1/collections', tokenChecker, collections);
app.use('/api/v1/objects', tokenChecker, objects);
app.use('/api/v1/logout', tokenChecker, logout);

app.use((req, res) => {
    res.status(404);
    res.json({success: false, message: 'Non trovato'});
});


module.exports = app;
