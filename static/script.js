const { getMaxListeners } = require("../app/app");

function login(){

    var email = document.getElementById("loginemail");
    var pass = document.getElementById("password");

    if(!email.checkValidity()){
        document.getElementById("errore").innerHTML = email.validationMessage;
        return;
    }
    if(!pass.checkValidity()){
        document.getElementById("errore").innerHTML = pass.validationMessage;
        return;
    }
    document.getElementById("errore").innerHTML = "";

    //console.log(email.value + " " + pass.value);

    var a = {email:email.value, password:pass.value};

    //console.log(a.email + " " + a.password);

    fetch('../authentication',{
        method:'post',
        headers:{'content-type':'application/json'},
        body:JSON.stringify(a)
    });

}
