"use strict"
const crypto = require('crypto');

class TokenFactory {

    // Create empty tokens array
    constructor(){
        this.tokens = [];
    }

    // Get user tokens by userID
    getUser(userID){
        for(let i in this.tokens){
            if(this.tokens[i].user === userID){
                return this.tokens[i];
            }
        }

        return null;
    }

    // Generate and save new token
    generateToken(userID){
        let user = this.getUser(userID);
        if(user === null){
            this.tokens.push({
                user: userID,
                tokens: []
            });

            user = this.getUser(userID);
        }

        let token = crypto.randomBytes(256).toString('hex');
        user.tokens.push(token);
        return token;
    }

    // If user iss logged out, remove his token
    dimissToken(userID, token){
        let user = this.getUser(userID);
        if(user === null){
            return false;
        }

        let index = user.tokens.indexOf(token);
        if(token > -1){
            user.tokens.splice(index, 1);
        }

        return true;
    }

    // For every request, validate user token
    validateToken(userID, token){
        let user = this.getUser(userID);
        if(user === null){
            return false;
        }

        for(let i in user.tokens){
            if(user.tokens[i] === token){
                console.log(token);
                return true;
            }
        }

        return false;
    }

}

module.exports = new TokenFactory();