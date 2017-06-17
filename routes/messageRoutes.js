'use strict'
let express = require('express');

const messageFactory = require('../class/MessageFactory');

let router = express.Router();

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