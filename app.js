const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

//Connect to DB
mongoose.connect(process.env.DB_URL,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then( () => {
    console.log('Connected to Database!')
});

//Init app
const app = express();

//Body Parser Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'ejs');

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Set routes
app.get('/', function(req,res) {
    res.render('pages/index');
})

//Import routes
const authentication = require('./routes/authentication.js');
const signup = require("./routes/signup.js");
const collections = require('./routes/collections.js');
const tokenChecker = require('./routes/tokenChecker.js');
const objects = require('./routes/objects.js');

app.use('/api/v1/authentication', authentication);
app.use("/api/v1/signup", signup);
app.use('/api/v1/collections', tokenChecker, collections);
app.use('/api/v1/objects', tokenChecker, objects);

//Start server
const port = process.env.PORT || 8080;
app.listen( port, () => {
    console.log(`Server listening on port ${port} and running...`);
});

app.use((req, res) => {
    res.status(404);
    res.json({success: false, message: 'Non trovato'});
});