"use strict"
const conversationFactory = require('./class/ConversationFactory');
const userFactory = require('./class/userFactory');

module.exports = (app) => {

    app.get('/', (req, res) => {
        res.send({
            message: 'Api works!'
        });
    });

    // Conversation routes
    app.get('/messages/:conversationID', (req, res) => {
        res.send(conversationFactory.get(req.params.conversationID));
    });

    app.post('/messages/:conversationID', (req, res) => {
        res.send(conversationFactory.addMessage(req.params.conversationID, conversationFactory.parseMessage(req.body)));
    });

    // User routes
    app.get('/users/:userID', (req, res) => {
        let userID = req.params.userID;
        
        if(parseInt(userID)){
            userFactory.get(userID, (user) => {
                res.send(user);
            }, (err) => {
                res.send(err);
            });
        } else {
            userFactory.find(userID, (user) => {
                res.send(user);
            }, (err) => {
                res.send(err);
            });
        }
    });

    app.post('/users/validate', (req, res) => {
        if(req.body === undefined || req.body.token === undefined || req.body.userID === undefined){
            res.send({
                error: "Token or userID is not provided"
            });
            return;
        }

        let token = req.body.token;
        let userID = req.body.userID;

        res.send({
            validToken: userFactory.validate(userID, token)
        });        
    });

    app.post('/users/authenticate', (req, res) => {
        if(req.body === undefined || req.body.login === undefined || req.body.password === undefined){
            res.send({
                error: "Login or password is not provided"
            });
            return;
        }


        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if(ip === "::1"){
            ip = "localhost";
        }

        let userData = userFactory.authenticate({
            ip: ip,
            login: req.body.login,
            password: req.body.password
        }, (data) => {
            res.send(data);
        }, (err) => {
            console.log(err);
            res.send({
                error: "User not authenticated"
            });
        });
    });
}