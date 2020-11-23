const { getMaxListeners } = require("../app/app");
  
function registrazione(){

    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const pass = document.getElementById("password");

    if(!nome.checkValidity()){
        document.getElementById("errore").innerHTML = nome.validationMessage;
    }

    if(!email.checkValidity()){
        document.getElementById("errore").innerHTML = email.validationMessage;
        return;
    }
    if(!pass.checkValidity()){
        document.getElementById("errore").innerHTML = pass.validationMessage;
        return;
    }
    document.getElementById("errore").innerHTML = "";

    //console.log(name: nome.value + " " + email.value + " " + pass.value);

    var daRegistrare = {name: nome.value, email:email.value, password:pass.value};

    //console.log(daRegistrare.name + " " + daRegistrare.email + " " + daRegistrare.password);

    fetch('../signup',{
        method:'post',
        headers:{'content-type':'application/json'},
        body:JSON.stringify(daRegistrare)
    }).then((resp) => resp.json())
    .then(function(data){
        console.log(data); // Dati di risposta da authentication
        console.log(data.message);
        console.log(data.error);
/*
        if(data.success){ // Se login andato a buon fine, reindirizza
             location.href = "./main.html"; // Da modificare, per ora solo per vedere l'effetto
        } else { // Altrimenti stampa errore riscontrato in authentication
             document.getElementById("errore").innerText = data.message;
        }
*/
    });

}
