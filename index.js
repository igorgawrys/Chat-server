var app = require('express')();
var http = require('http').createServer(app);

app.get('/', function(req, res){

    res.sendFile(__dirname + '/www/index.html');

});

http.listen(3000, function(){
    console.log("Server started at port 3000");
});