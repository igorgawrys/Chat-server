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

    checkIfConversationExists(conversationID){
        return new Promise((resolve, reject) => {
            this.mongo.listCollections().toArray((err, doc) => {
                for(let i in doc){
                    if(doc[i].name === "conversation_" + conversationID){
                        return resolve();
                    }
                }

                return reject("Conversation not found :(");
            });
        });
    }

    getConversation(conversationID){
        conversationID = "conversation_" + conversationID;
        let collection = this.mongo.collection(conversationID);
        return new Promise((resolve, reject) => {            
            collection.find({}).toArray((err, doc) => {
                if(err){
                    return reject(err);
                }

                return resolve(doc);
            });
        });
    }

    sendMessage(conversationID, userID, message){
        conversationID = "conversation_" + conversationID;
        let collection = this.mongo.collection(conversationID);
        return new Promise((resolve, reject) => {
            
            message = {
                senderID: userID,
                message: message,
                read: false,
                date: new Date()
            };

            let result = collection.insert(message);
            if(result.insertedCount > 0){
                return resolve(message);
            }
            return reject(result);
        });
    }

}

module.exports = new MessageFactory();