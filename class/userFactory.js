"use strict"
let passwordFactory = require('./PasswordFactory');

let userNextID = 1;

class User {
    constructor(userData){
        this.login = userData.login;
        this.id = userNextID++;
    }

    getID(){
        return this.id;
    }

    getLogin(){
        return this.login;
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

let exampleUsers = [
    {
        login: "arturczuba",
        password: "AlaMaKota"
    }, {
        login: "rafalgogol",
        password: "AlaMaKota"
    }, {
        login: "paupau",
        password: "AlaNieMaKota"
    }
];

let instance;

class userFactory {

    constructor(){
        this.users = [];
        instance = this;

        while(exampleUsers.length > 0){
            let user = this.create(exampleUsers.pop());           
        }
    }

    find(userLogin){
        for(let i in instance.users){
            if(userLogin == instance.users[i].getLogin()){
               return instance.users[i].getID(); 
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
            
            console.log("User " + user.login + " was created");
            return user;    
        }

        return false;
    }

    authenticate(userLogin, userPass){
        return passwordFactory.validate(this.find(userLogin), userPass);
    }
}
module.exports = new userFactory();