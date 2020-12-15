fetch('../api/v1/collections', {
    method: 'get',
    headers: {'token': localStorage.token}
}).then((resp) => resp.json())
.then(function(data){
    //console.log(data);

    document.getElementById("nome_utente").innerHTML = "Benvenuto " + data.user[0].name;
    document.getElementById("crea_col").setAttribute("href", "./creaCollezione.html?email=" + data.user[0].email);

    //Modal
    var modalModifica = document.querySelector(".modal-modifica");
    var modalCancella = document.querySelector(".modal-cancella");
    var inputModal = document.getElementById("id-coll-modal");
    var modalCloseM = document.querySelector(".modal-m-close");
    var modalCloseC = document.querySelector(".modal-c-close");
    modalCloseM.addEventListener('click',function(){
        modalModifica.classList.remove('modal-attiva'); 
        inputModal.setAttribute("value", "");
        document.getElementById("errore-modal").innerHTML = '';
    });
    modalCloseC.addEventListener('click',function(){
        modalCancella.classList.remove('modal-attiva');
        inputModal.setAttribute("value", "");
    });

    for(var i=0; i < data.collections.length; i++){

        var col = document.createElement("div");
        col.className = "column";
        var a = document.createElement("a");
        a.setAttribute("href", "./object.html?id=" + data.collections[i].id_coll);
        a.className = "a-proj"
        var card = document.createElement("div");
        card.className = "card";
        var btn1 = document.createElement("button");
        btn1.className = "btn-proj cancel";
        btn1.setAttribute("id", data.collections[i].id_coll);
        var btn2 = document.createElement("button");
        btn2.className = "btn-proj change";
        btn2.setAttribute("id", data.collections[i].id_coll);
        var txt = document.createElement("h3");
        txt.innerHTML = data.collections[i].name;

        //Modal
        btn1.addEventListener('click',function(){
            modalCancella.classList.add('modal-attiva');
            inputModal.setAttribute("value", event.target.getAttribute('id'));
        });
        btn2.addEventListener('click',function(){
            modalModifica.classList.add('modal-attiva');
            inputModal.setAttribute("value", event.target.getAttribute('id'));
        });

        col.appendChild(btn1);
        col.appendChild(btn2);
        card.appendChild(txt);
        a.appendChild(card);
        col.appendChild(a);

        document.getElementById("griglia").appendChild(col);
    }
});

function modificaCollezione(){
    var nuovoNome = document.getElementById("nuovo-nome");
    var id_coll = document.getElementById("id-coll-modal");
    
    if(!nuovoNome.value){
        document.getElementById("errore-modal").innerHTML = 'Inserire un nuovo nome';
        return;
    }

    console.log('Modifica nome: ' + id_coll.value + ' ' + nuovoNome.value);
    
    var a = {token: localStorage.token, nuovoNome: nuovoNome.value};
    //Implementare metodi
    fetch('../api/v1/collections/'+id_coll.value, {
        method: 'PATCH',
        headers:{'content-type':'application/json'},
        body: JSON.stringify(a)
    }).then((resp) => resp.json())
    .then(function(data){
        console.log(data);
        
        location.href = "./main.html"
    });
}

function eliminaCollezione(){
    var id_coll = document.getElementById("id-coll-modal");

    console.log('Elimina collezione: ' + id_coll.value);

    var a = {id_coll: id_coll.value, token: localStorage.token}

    fetch('../api/v1/collections', {
        method: 'delete',
        headers:{'content-type':'application/json'},
        body: JSON.stringify(a)
    }).then((resp) => resp.json())
    .then(function(data){
        console.log(data);
        
        location.href = "./main.html"
    });
}