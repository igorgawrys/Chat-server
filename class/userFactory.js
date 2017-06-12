"use strict"

const db = require('../database');

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
            let user = this.create(exampleUsers.pop(), (message) => {
                console.log(message);
            }, (err) => {
                console.error(err);
            });           
        }
    }

    find(userLogin, callbackSuccess, callbackFailed){

        db.query("SELECT * FROM users WHERE login = ?", [userLogin], (err, rows) => {
            if(err){
                console.log(err);
                callbackFailed(err);
                return false;
            }
            callbackSuccess(rows);
        });

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

    findByWS(ws){
        for(let i in this.users){
            if(ws == this.users[i].getWebSocket()){
               return this.users[i]; 
            }
        }
        return null;
    }

    create(userData, callbackSuccess, callbackFailed){
        let user = User.Parse(userData);
        if(user !== false){
            this.find(user.login, (result) => {
                if(result.length > 0){
                    callbackFailed("User already exists!");
                    return;
                }

                db.query('INSERT INTO users set login = ?', [user.login], (err) => {
                    if(err){
                        callbackFailed(err);
                    }

                    callbackSuccess("User created");
                });
            });
            // if(this.find(user.login) === undefined){
            //     this.users.push(user);
            //     return user;
            // }

            return false;   
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