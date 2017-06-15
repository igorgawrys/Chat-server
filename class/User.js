let passwordFactory = require('./PasswordFactory');

class User {
    constructor(userData){
        this.login = userData.login;

        if(userData.userID !== undefined){
            this.id = userData.userID;
        }

        this.ws = undefined; // Hold WebSocket connection

        if(userData.friends !== undefined){
            this.friends = userData.friends;
        } else {
            this.friends = [];
        }
    }

    getID(){
        return this.id;
    }

    getLogin(){
        return this.login;
    }

    getFriends(){
        return this.friends;
    } 

    assignWebSocket(ws){
        this.ws = ws;
    }

    getWebSocket(){
        return this.ws;
    }

    static Parse(userData){
        if(userData.login === undefined){
            return false;
        }

        return new User(userData);
    }

}

module.exports = User;