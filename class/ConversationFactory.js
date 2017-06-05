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

    get(convesationID) {
        for (let i in this.conversations) {
            if (i === convesationID) {
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

    addMessage(conversationID, message) {
        this.get(conversationID).push(message);
        return message;
    }
}

module.exports = new ConversationFactory();