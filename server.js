const app = require('express')();
const bodyParser = require('body-parser');

const userFactory = require('./class/userFactory');
const tokenFactory = require('./class/TokenFactory');

let allowedOrigins = [
    'http://localhost:3001',
    'http://localhost:8012',
    'http://localhost:4200'
];

let publicEndpoints = [
    '/users/authenticate',
    '/users/create'
];

// Allow cross origin for multiple domains
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');

    let origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authentication, Authorization');

    if(publicEndpoints.indexOf(req.url) > -1){
        next();
    } else {
        let token = req.get('Authorization');
        if(token === undefined){
            res.send({
                error: "Missing token"
            });
        } else {
            token = token.split(" ")[1];
            tokenFactory.checkIfExists(token)
                .then(() => {
                    next();
                })
                .catch((err) => {
                    res.status(401).send({
                        error: err
                    });
                });
        }

        
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



const server = require('http').createServer(app);
//const WebSocketServer = require('ws');
//const ws = new WebSocketServer.Server({ server });

// Define user routes
let userRoutes = require('./routes/userRoutes');
let messageRoutes = require('./routes/messageRoutes');
//const wsRoutes = require('./ws-routes')(ws);

app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

server.listen(3000, () => {
    let message = "Server is running on port: " + server.address().port;
    console.log(message);
});