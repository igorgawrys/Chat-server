const app = require('express')();
const bodyParser = require('body-parser');

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



const server = require('http').createServer(app);
const WebSocketServer = require('ws');
const ws = new WebSocketServer.Server({ server });

// Define routes
const routes = require('./routes')(app);
const wsRoutes = require('./ws-routes')(ws);

server.listen(3000, () => {
    console.log("Server is running on port: " + server.address().port);
});