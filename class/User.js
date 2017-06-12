let passwordFactory = require('./PasswordFactory');
let userNextID = 1;

class User {
    constructor(userData){
        this.login = userData.login;
        this.id = userNextID++;

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
        let user = new User(userData);
        passwordFactory.generatePassword(user.id, userData.password);

        return user;
    }

}

module.exports = User;