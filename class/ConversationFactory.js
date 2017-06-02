"use strict"

class ConversationFactory {
     
    constructor() {
        this.conversations = {
            1: [{
                from: 500,
                content: "Hej!",
                readBy: [501]
            }, {
                from: 501,
                content: "Witaj!"
            }, {
                from: 501,
                content: 'https://i.ytimg.com/vi/pVrDRLOeMKY/hqdefault.jpg'
            }]
        };
    }

    getConversation(conversation_id) {
        for (let i in this.conversations) {
            if (i === conversation_id) {
                return this.conversations[i];
            }
        }

        return [];
    };

    parseMessage(postData) {
        if(postData.from === undefined || postData.content === undefined){
            return false;
        }

        let newMessage = {
            from: postData.from,
            content: postData.content
        };

        // TODO validation of message content

        return newMessage;
    }

    addMessage(conversation_id, message) {
        this.getConversation(conversation_id).push(message);
        return message;
    }
}

module.exports = new ConversationFactory();