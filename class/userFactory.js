"use strict"
let User = require('./User');
let tokenFactory = require('./TokenFactory');
let passwordFactory = require('./PasswordFactory');

let exampleUsers = [
    {
        login: "a",
        password: "a",
        friends: [1]
    }, {
        login: "rafalgogol",
        password: "AlaMaKota"
    }, {
        login: "paupau",
        password: "AlaNieMaKota",
        friends: [3]
    }
];

class userFactory {

    constructor(){
        this.users = [];

        while(exampleUsers.length > 0){
            let user = this.create(exampleUsers.pop());           
        }
    }

    find(userLogin){
        for(let i in this.users){
            if(userLogin == this.users[i].getLogin()){
               return this.users[i].getID(); 
            }
        }

        return null;
    }

    get(userID){
        for(let i in this.users){
            if(userID == this.users[i].getID()){
               return this.users[i]; 
            }
        }
        return null;
    }

    create(userData){
        let user = User.Parse(userData);
        if(user !== false){
            this.users.push(user);
            return user;    
        }

        return false;
    }

    // On success - send new token to user
    authenticate(userLogin, userPass){
        let userID = this.find(userLogin);
        if(passwordFactory.validate(userID, userPass)){
            return {
                userID: userID,
                token: tokenFactory.generateToken(userID)
            }
        }

        return false;
    }

    validate(userID, userToken){
        return tokenFactory.validateToken(userID, userToken);
    }
}
module.exports = new userFactory();