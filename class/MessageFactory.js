'use strict'
const db = require('../database');
let mongo = require('mongodb').MongoClient;

class MessageFactory {

    constructor() {
        mongo.connect('mongodb://root:root@ds129422.mlab.com:29422/chat-database', (err, _db) => {
            if(err){
                console.error(err);
                process.exit();   
            }

            this.mongo = _db;
        });
    }

    getConversationList(token){
        return new Promise((resolve, reject) => {
            db.query('SELECT conversations.conversationID FROM tokens JOIN users ON tokens.userID = users.userID JOIN userconversations as conversations ON conversations.userID = users.userID WHERE tokens.token = ?', [token], (err, rows) => {
                if(err){
                    return reject("Cannot get conversations list");
                }
                return resolve(rows);
            });
        });
        
    }

    getConversation(conversationID){
        return new Promise((resolve, reject) => {
            let collection = this.mongo.collection("messages");
            collection.find({ id: parseInt(conversationID) }, {messages: {$slice: [-6, 3]}}).toArray((err, doc) => {
                if(err){
                    return reject(err);
                }

                if(doc.length === 0){
                    return reject("Conversation not found");
                }

                let messages = doc[0].messages;
                return resolve(messages);
            });
        });
    }

}

module.exports = new MessageFactory();