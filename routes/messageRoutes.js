'use strict'
let express = require('express');

const messageFactory = require('../class/MessageFactory');

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
    messageFactory.getConversation(req.params.conversationID)
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

module.exports = router;