fetch('../api/v1/collections', {
    method: 'get',
    headers: {'token': localStorage.token}
}).then((resp) => resp.json())
.then(function(data){
    console.log(data);

   document.getElementById("nome_utente").innerHTML = "Benvenuto " + data.user[0].name;

   document.getElementById("crea_col").setAttribute("href", "./creaCollezione.html?email=" + data.user[0].email);

    for(var i=0; i < data.collections.length; i++){

        var col = document.createElement("div");
        col.className = "column";
        var a = document.createElement("a");
        a.setAttribute("href", "./object.html?id=" + data.collections[i].id_coll);
        a.className = "btn-proj"
        var card = document.createElement("div");
        card.className = "card";
        var txt = document.createElement("h3");
        txt.innerHTML = data.collections[i].name;

        card.appendChild(txt);
        a.appendChild(card);
        col.appendChild(a);

        document.getElementById("griglia").appendChild(col);
    }

});
