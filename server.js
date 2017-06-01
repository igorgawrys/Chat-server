const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');

// Get default server port
const port = process.env.port || '3000';
// And set it in express
app.set('port', port);

// Set response to JSON
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        message: 'Api works!'
    }));
});


app.get('/messages', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.send(JSON.stringify([
        {
            content: "Cześć Artur!"
        }, {
            content: "Hej!"
        }, {
            content: "Wiesz że to tylko demo? :P"
        }, {
            content: "Wiem :D"
        }
    ]));
});

// SetUp server
const server = http.createServer(app);
server.listen(port, () => {
    console.log("Api is running at port:" + port);
});