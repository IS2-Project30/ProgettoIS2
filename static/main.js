fetch('../collections', {
    method: 'get',
    headers: {'token': localStorage.token}
}).then((resp) => resp.json())
.then(function(data){
    console.log(data);
});
