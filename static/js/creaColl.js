function crea(){

    const urlParam = new URLSearchParams(window.location.search);
    const email = urlParam.get('email');

    const nome = document.getElementById("name");

    if(!nome.checkValidity()){
        document.getElementById("errore").innerHTML = nome.validationMessage;
        return;
    }

    document.getElementById("errore").innerHTML = "";

    const coll = {name: nome.value, email: email};
    var body = {token: localStorage.token, coll: coll};

    console.log(body);

    fetch('../api/v1/collections', {
        method:'post',
        headers:{'content-type':'application/json'},
        body: JSON.stringify(body)
    }).then((resp) => resp.json())
    .then((data) => {
        console.log(data); // Dati di risposta da collections
        console.log(data.message);
        console.log(data.success);

        location.href = "./main.html";
    });
}
