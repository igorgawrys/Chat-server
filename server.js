const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');

// Get default server port
const port = process.env.port || '3000';
// And set it in express
app.set('port', port);

let allowedOrigins = [
    'http://localhost:3001',
    'http://localhost:8012',
    'http://localhost:4200'
]

// Allow cross origin for multiple domains
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');

    let origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

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
            content: "Hej!",
            readBy: [ 501 ]
        }, {
            from: 501,
            content: "Witaj!"
        }, {
            from: 501,
            content: 'https://avatars0.githubusercontent.com/u/4172079?v=3&s=88'
        }
    ]
}

function findConversation(conversation_id){
    for(let i in conversations){
        if(i === conversation_id){
            return conversations[i];
        }
    }

    return [];
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/messages/:conversation_id', (req, res) => {
    res.send(findConversation(req.params.conversation_id));
});

app.post('/messages/:conversation_id', (req, res) => {

    let conversation = findConversation(req.params.conversation_id);
    let newMessage = {
        from: req.body.from,
        type: req.body.type,
        content: req.body.content
    };

    conversation.push(newMessage);
    res.send(newMessage);
});

// SetUp server
const server = http.createServer(app);
server.listen(port, () => {
    console.log("Api is running at port:" + port);
});