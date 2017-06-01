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

let conversations = {
    1: [
        {
            from: 500,
            type: 'text',
            content: "Hej!",
            readBy: [ 501 ]
        }, {
            from: 501,
            type: 'text',
            content: "Witaj!"
        }, {
            from: 501,
            type: 'image',
            content: 'https://avatars0.githubusercontent.com/u/4172079?v=3&s=88'
        }
    ]
}

app.get('/messages/:conversation_id', (req, res) => {
    let conversation_id = req.params.conversation_id;
    let conversation = [];
    for(let i in conversations){
        if(i === conversation_id){
            conversation = conversations[i];
            break;
        }
    }

    res.send(conversation);
});

// SetUp server
const server = http.createServer(app);
server.listen(port, () => {
    console.log("Api is running at port:" + port);
});