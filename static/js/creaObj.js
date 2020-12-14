function crea(){
    const urlParam = new URLSearchParams(window.location.search);
    const id_coll = urlParam.get('id_coll');

    const nome = document.getElementById("name");

    if(!nome.checkValidity()){
        document.getElementById("errore").innerHTML = nome.validationMessage;
        return;
    }

    document.getElementById("errore").innerHTML = "";

    const obj = {name: nome.value, id_coll: id_coll};
    var body = {token: localStorage.token, obj: obj};

    console.log(body);

    fetch('../api/v1/objects', {
        method:'post',
        headers:{'content-type':'application/json'},
        body: JSON.stringify(body)
    }).then((resp) => resp.json())
    .then((data) => {
        console.log(data); // Dati di risposta da collections
        console.log(data.message);
        console.log(data.success);

        location.href = "./object.html?id=" + id_coll;
    });
}