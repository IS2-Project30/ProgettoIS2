const urlParam = new URLSearchParams(window.location.search);
const id_coll = urlParam.get('id');

fetch('../api/v1/objects?id_coll='+id_coll, {
    method: 'get',
    headers: {'token': localStorage.token}
}).then((resp) => resp.json())
.then(function(data){
    console.log(data);

    document.getElementById("nome_collezione").innerHTML = "Collezione " + data.coll_name;
    document.getElementById("crea_obj").setAttribute("href", "./creaOggetto.html?id_coll=" + id_coll);

    //Modal
    var modalModifica = document.querySelector(".modal-modifica");
    var modalCancella = document.querySelector(".modal-cancella");
    var inputModal = document.getElementById("id-obj-modal");
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

    for(var i=0; i < data.objects.length; i++){

        var col = document.createElement("div");
        col.className = "column";
        var card = document.createElement("div");
        card.className = "card";
        var btn1 = document.createElement("button");
        btn1.className = "btn-proj cancel";
        btn1.setAttribute("id", data.objects[i]._id);
        var btn2 = document.createElement("button");
        btn2.className = "btn-proj change";
        btn2.setAttribute("id", data.objects[i]._id);
        var txt = document.createElement("h3");
        txt.className = "nome-oggetto";
        txt.innerHTML = data.objects[i].name;
        var div = document.createElement("div");
        div.className = "scroll";

        for(var j = 0;j<data.objects[i].tag_list.length;j++){
            var div1 = document.createElement("div");
            div1.className = "tag";
            var txt1 = document.createElement("b");
            txt1.innerHTML = 'Nome: ';
            var nome = document.createElement("label");
            nome.innerHTML = data.objects[i].tag_list[j].tag;
            nome.setAttribute('style', 'font-size : 18px; font-family: verdana;');
            var br = document.createElement("br");
            var txt2 = document.createElement("b");
            txt2.innerHTML = 'Valore: ';
            var valore = document.createElement("label");
            valore.innerHTML = data.objects[i].tag_list[j].value;
            valore.setAttribute('style', 'font-size : 18px; font-family: verdana;');
        
            div1.appendChild(txt1);
            div1.appendChild(nome);
            div1.appendChild(br);
            div1.appendChild(txt2);;
            div1.appendChild(valore);

            div.appendChild(div1);
        }
        
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
        card.appendChild(txt);;
        col.appendChild(card);
        col.appendChild(div);

        document.querySelector(".row").appendChild(col);
    }
});

function eliminaOggetto(){
    var id_obj = document.getElementById("id-obj-modal");

    console.log('Elimina oggetto: ' + id_obj.value);

    var a = {id_obj: id_obj.value, token: localStorage.token}

    fetch('../api/v1/objects', {
        method: 'delete',
        headers:{'content-type':'application/json'},
        body: JSON.stringify(a)
    }).then((resp) => resp.json())
    .then(function(data){
        console.log(data);
        
        location.href = "./object.html?id=" + id_coll;
    });
}

function modificaOggetto(){
    var nuovoNome = document.getElementById("nuovo-nome");
    var id_obj = document.getElementById("id-obj-modal");
    
    if(!nuovoNome.value){
        nuovoNome.value = obj.name;
    }

    for(var i=0; i < obj.tag_list.length; i++){

        var div1 = document.createElement("div");

        var txt1 = document.createElement("label");
        txt1.innerHTML = 'Nome';
        var input1 = document.createElement("input");
        input1.setAttribute("placeholder", obj.tag_list[i].tag);
        var txt2 = document.createElement("label");
        txt2.innerHTML = 'Valore';
        var input2 = document.createElement("input");
        input2.setAttribute("placeholder", obj.tag_list[i].value);

        div1.appendChild(txt1);
        div1.appendChild(input1);
        div1.appendChild(txt2);;
        div1.appendChild(input2);

        document.getElementById("modal-tag").appendChild(div1);
    }

    console.log('Modifica nome: ' + id_obj.value + ' ' + nuovoNome.value);
    //Implementare metodi
}

