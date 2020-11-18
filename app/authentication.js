const express = require('express');
const router = express.Router();

router.post('', async function(req, res){

    console.log(req.body.email);
});

router.get('', function(req, res){ 
    console.log("email arrivata.");
});

module.exports = router;