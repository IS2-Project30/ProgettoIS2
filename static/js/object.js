const urlParam = new URLSearchParams(window.location.search);
const id_coll = urlParam.get('id');

fetch('../api/v1/objects?id_coll='+id_coll, {
    method: 'get',
    headers: {'token': localStorage.token}
}).then((resp) => resp.json())
.then(function(data){
    console.log(data);

    document.getElementById("nome_collezione").innerHTML = "Collezione " + data.coll_name;

    document.getElementById("crea_obj").setAttribute("href", "#");

    for(var i=0; i < data.objects.length; i++){

        var col = document.createElement("div");
        col.className = "column";
        var a = document.createElement("a");
        a.setAttribute("href", "#");
        a.className = "btn-proj"
        var card = document.createElement("div");
        card.className = "card";
        var txt = document.createElement("h3");
        txt.innerHTML = data.objects[i].name;

        card.appendChild(txt);
        a.appendChild(card);
        col.appendChild(a);

        document.getElementById("griglia").appendChild(col);
    }
});