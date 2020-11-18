const { getMaxListeners } = require("../app/app");

function login(){

    var email = document.getElementById("loginemail").value;

    console.log(email);

    var a = {email:email};

    fetch('../authentication',{
        method:'post',
        headers:{'content-type':'application/json'},
        body:JSON.stringify(a)
    });
}