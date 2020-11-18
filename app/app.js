const express = require('express');
const app = express();

const authentication = require('./authentication.js');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', express.static('static'));

app.use('/authentication', authentication);

app.use((req, res) => { 
    res.status(404);
    res.json({error: 'Not found'});
});


module.exports = app;