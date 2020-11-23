const { getMaxListeners } = require("../app/app");

function login(){

    const email = document.getElementById("loginemail");
    const pass = document.getElementById("password");

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
    }).then((resp) => resp.json())
    .then(function(data){
        console.log(data); // Dati di risposta da authentication
        console.log(data.message);
        console.log(data.success);
        console.log(data.token);

        setCookie(data.token);

        if(data.success){ // Se login andato a buon fine, reindirizza
             location.href = "./main.html"; // Da modificare, per ora solo per vedere l'effetto
        } else { // Altrimenti stampa errore riscontrato in authentication
             document.getElementById("errore").innerText = data.message;
        }
    });
}

function setCookie(token){
    var now = new Date();
    var time = now.getTime();
    time += 3600 * 1000; // Durata 1 ora
    now.setTime(time);
    document.cookie = "t=" + token + "; expires=" + now.toUTCString() + "; path=/"; // Set del cookie
}
