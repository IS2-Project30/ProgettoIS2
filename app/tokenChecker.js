const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const Blacklist = require('./models/Blacklist');

const tokenChecker = async function(req, res, next) {

    // Controllo se esiste un token
    var token = req.body.token || req.query.token || req.headers['token'];

    // Se non trovo alcun token
    if (!token) {
        return res.status(401).send({ 
            success: false,
            message: 'Nessun token fornito.'
        });
    }

    try{ // Controllo se il token è stato inserito precedentemente in blacklist
        var result = await Blacklist.findOne({token: token});
    } catch(err){
        return res.status(500).json({success: false, message: "Errore sul db."});
    }
    if(result){ // Se in blacklist rispondo con errore
        return res.status(401).json({success: false, message: "Logout già effettuato."});
    }

    // Decodifica del token
    jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {
        if (err) {
            return res.status(403).send({
                success: false,
                message: 'Fallimento autenticazione token.'
            });		
        } else {
            // Se andato a buon fine salvo le informazioni
            req.loggedUser = decoded;
            // console.log("Decodifica token: " + JSON.stringify(decoded)); // Stampa di controllo
            next();
        }
    });
	
};

module.exports = tokenChecker
