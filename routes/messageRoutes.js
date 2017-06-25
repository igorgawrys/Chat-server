'use strict'
let express = require('express');

const messageFactory = require('../class/MessageFactory');
const userFactory = require('../class/userFactory');

let router = express.Router();

router.route('/').post((req, res) => {

    let token = req.get('Authorization');
    token = token.split(" ")[1];

    messageFactory.getConversationList(token)
        .then((list) => {
            res.send(list);
        })
        .catch((err) => {
            console.error(err);
            res.send({
                error: err
            });
        });
});

router.route('/:conversationID').get((req, res) => {
    let conversationID = req.params.conversationID;
    messageFactory.checkIfConversationExists(conversationID)
        .then(() => {
            return messageFactory.getConversation(conversationID);
        })
        .then((response) => {
            res.send(response);
        })
        .catch((err) => {
            console.error(err);
            res.send({
                error: err
            });
        });
});

router.route('/:conversationID').post((req, res) => {
    let userID = undefined;
    userFactory.getID(req.get('Authorization').split(' ')[1])
        .then((_userID) => {
            userID = _userID;
            console.log(_userID);
            return messageFactory.sendMessage(req.params.conversationID, userID, req.body.message);
        })
        .then((response) => {
            console.log(response);
            res.send(response);
        })
        .catch((err) => {
            console.error(err);
            res.status(404).body({
                error: err
            });
        })
});

module.exports = router;