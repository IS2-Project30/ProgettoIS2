const app = require('./app/app.js');
var mongoose = require('mongoose');

//Connect to DB
mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true, useUnifiedTopology: true })
.then( () => {
    
    console.log('Connected to Database!')

    //Start server
    const port = process.env.PORT || 8080;
    app.listen( port, () => {
        console.log(`Server listening on port ${port} and running...`);
    });
});