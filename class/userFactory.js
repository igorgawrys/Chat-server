"use strict"

const db = require('../database');

let User = require('./User');
let tokenFactory = require('./TokenFactory');
let passwordFactory = require('./PasswordFactory');

class userFactory {

    // Find user in db by user login
    find(userLogin, callbackSuccess, callbackFailed){
        db.query("SELECT * FROM users WHERE login = ? LIMIT 1", [userLogin], (err, rows) => {
            if(err){
                console.log(err);
                callbackFailed(err);
                return false;
            }
            
            let user = null;

            if(rows.length > 0){
                user = User.Parse(rows[0]);
            }
            
            if(user !== null){
                callbackSuccess(user);
            } else {
                callbackFailed("User not found");
            }
        });
    }

    // Get user from db by id
    get(userID, callbackSuccess, callbackFailed){
        db.query("SELECT * FROM users WHERE userID = ? LIMIT 1", [userID], (err, rows) => {
            if(err){
                console.log(err);
                callbackFailed(err);
                return false;
            }
            
            let user = null;

            if(rows.length > 0){
                user = User.Parse(rows[0]);
            }
            
            if(user !== null){
                callbackSuccess(user);
            } else {
                callbackFailed("User not found");
            }
        });
    }

    // Create new user
    create(userData, callbackSuccess, callbackFailed){
        let user = User.Parse(userData);
        if(user !== false){
            this.find(user.login, (result) => {
                if(result !== null){
                    callbackFailed("User already exists!");
                    return;
                }

                db.query('INSERT INTO users SET login = ?', [user.login], (err) => {
                    if(err){
                        callbackFailed(err);
                    }

                    this.find(user.login, (user) => {

                        if(!user){
                            callbackFailed("User not found after create");
                            return;
                        }

                        let hash = passwordFactory.encrypt(userData.password);
                        passwordFactory.savePassword(user.getID(), hash, () => {
                            callbackSuccess("User created");
                        }, callbackFailed);
                    }, callbackFailed);

                    
                });
            });
            
            return false;   
        }

        return false;
    }

    // Login user - send new token
    authenticate(userData, callbackSuccess, callbackFailed){
        this.find(userData.login, (user) => {
            if(!user){
                callbackFailed("User not found");
                return false;
            }

            passwordFactory.validate(user.getID(), userData.password, () => {
                tokenFactory.generateToken(user.getID(), userData.ip, (token) => {
                    callbackSuccess({
                        token: token
                    });
                }, callbackFailed);

            }, callbackFailed);
        });
    }
}
module.exports = new userFactory();