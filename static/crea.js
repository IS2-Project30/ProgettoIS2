function crea(){

    const nome = document.getElementById("name");
    const email = document.getElementById("email");

    if(!nome.checkValidity()){
        document.getElementById("errore").innerHTML = nome.validationMessage;
        return;
    }

    if(!email.checkValidity()){
        document.getElementById("errore").innerHTML = email.validationMessage;
        return;
    }
    document.getElementById("errore").innerHTML = "";

    const coll = {name: nome.value, email: email.value};

    fetch('../collections', {
        method:'post',
        headers:{'content-type':'application/json'},
        body:JSON.stringify(coll)
    }).then((resp) => resp.json())
    .then((data) => {
        console.log(data); // Dati di risposta da collections
        console.log(data.message);
        console.log(data.success);
    });


}
