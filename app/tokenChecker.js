const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const tokenChecker = function(req, res, next) {
	
	// Controllo se esiste un token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// Se non trovo alcun token
	if (!token) {
		return res.status(401).send({ 
			success: false,
			message: 'Nessun token fornito.'
		});
	}

	// decodifica del token
	jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {			
		if (err) {
			return res.status(403).send({
				success: false,
				message: 'Fallimento autenticazione token.'
			});		
		} else {
			// if everything is good, save to request for use in other routes
			req.loggedUser = decoded;
                        console.log(decoded);
			next();
		}
	});
	
};

module.exports = tokenChecker
