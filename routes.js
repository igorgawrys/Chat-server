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
        res.send(userFactory.get(req.params.userID));
    });

    app.post('/users/authenticate', (req, res) => {
        if(req.body === undefined || req.body.login === undefined || req.body.password === undefined){
            res.send({
                message: "Login or password is not provided"
            });
            return;
        }

        let login = req.body.login;
        let password = req.body.password;
        
        let userToken = userFactory.authenticate(login, password);

        if(userToken === false){
            res.send({
                message: "User not authenticated"
            });

            return;
        } else {
            res.send({
                token: userToken
            });
        }
    });
}