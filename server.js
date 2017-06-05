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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Define routes
const routes = require('./routes')(app);

// SetUp server
const server = http.createServer(app);
server.listen(port, () => {
    console.log("Api is running at port:" + port);
});