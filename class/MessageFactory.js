'use strict'

let mongo = require('mongodb').MongoClient;

class MessageFactory {

    constructor() {
        mongo.connect('mongodb://root:root@ds129422.mlab.com:29422/chat-database', (err, _db) => {
            if(err){
                console.error(err);
                process.exit();   
            }

            this.db = _db;
        });
    }

    getConversationList(){
        
    }

    getConversation(conversationID){
        return new Promise((resolve, reject) => {
            let collection = this.db.collection("messages");
            collection.find({ id: parseInt(conversationID) }, {messages: {$slice: [-6, 3]}}).toArray((err, doc) => {
                if(err){
                    return reject(err);
                }

                if(doc.length === 0){
                    return reject("Conversation not found");
                }

                let messages = doc[0].messages;
                console.log(messages);
                return resolve(messages);
            });
        });
    }

}

module.exports = new MessageFactory();