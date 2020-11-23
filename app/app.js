const express = require('express');
const app = express();

//Import Routes
const authentication = require('./authentication.js');
const signup = require("./signup.js");
const createCollection = require('./createCollection.js');

//Rutes Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', express.static('static'));

app.use("/signup", signup);
app.use('/authentication', authentication);
app.use('/createCollection', createCollection);

app.use((req, res) => {
    res.status(404);
    res.json({error: 'Not found'});
});


module.exports = app;
