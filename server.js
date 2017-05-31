var app = require('express')();
var http = require('http').createServer(app);


app.get('/', function(req, res){});

http.listen(3000, function(){
    console.log("Server started at port 3000");
});