function logout(){

    fetch('../api/v1/logout', {
        method: 'post',
        headers: {token: localStorage.getItem('token'), 'content-type':'application/json'}
    }).then((resp) => resp.json())
    .then(function(data){
        if(data.success){ // Se logout andato a buon fine, reindirizza
            localStorage.removeItem('token');
            location.href = "./login.html"; // Da modificare, per ora solo per vedere l'effetto
        } else { // Altrimenti stampa errore riscontrato in authentication
            window.alert("Logout non effettuato per problema sul server.");
        }
    });

}
