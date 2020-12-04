function crea(){

    const nome = document.getElementById("name");
    const email = document.getElementById("email");

    console.log('nome='+nome.value+' email='+email.value)

    if(!nome.checkValidity()){
        document.getElementById("errore").innerHTML = nome.validationMessage;
        return;
    }

    if(!email.checkValidity()){
        document.getElementById("errore").innerHTML = email.validationMessage;
        return;
    }
    document.getElementById("errore").innerHTML = "";

    const coll = {name: nome.value, email: email.value , token: localStorage.getItem('token')};
    console.log(JSON.stringify(coll))

    fetch('/api/v1/collections', {
        method:'post',
        headers:{'content-type':'application/json'},
        body:JSON.stringify(coll)
    }).then((resp) => resp.json())
    .then((data) => {
        console.log(data); // Dati di risposta da collections
        console.log(data.message);
        console.log(data.success);

        if(data.success){ // Se l'inserimento della collezione è andato a buon fine, reindirizza
            
            location.href = "/api/v1/collections?token=" + localStorage.getItem('token') + "&name=" + nome.value + "&email=" + email.value;
    
        } else { // Altrimenti stampa errore riscontrato in authentication
            document.getElementById("errore").innerText = data.message;
        }
    });
}
