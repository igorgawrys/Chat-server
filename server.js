const express = require('express');
const app = express();
const http = require('http');

// Get default server port
const port = process.env.port || '3000';
// And set it in express
app.set('port', port);

let allowedOrigins = [
    'http://localhost:3001',
    'http://localhost:8012'
]

// Allow cross origin for multiple domains
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');

    let origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    next();
});

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        message: 'Api works!'
    }));
});


app.get('/messages', (req, res) => {
    res.send(JSON.stringify([
        {
            content: "Cześć Artur!",
            type: "text"
        }, {
            content: "Hej!",
            type: "text"
        }, {
            content: "Wiesz że to tylko demo? :P",
            type: "text"
        }, {
            content: "Wiem :D",
            type: "text"
        }, {
            content: "https://avatars0.githubusercontent.com/u/4172079?v=3&s=88",
            type: "image"
        }
    ]));
});

// SetUp server
const server = http.createServer(app);
server.listen(port, () => {
    console.log("Api is running at port:" + port);
});