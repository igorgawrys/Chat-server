'use strict'

const db = require('../database');

let User = require('./User');
let tokenFactory = require('./TokenFactory');
let passwordFactory = require('./PasswordFactory');

class userFactory {

    // Find user in db by user login
    find(userLogin, callbackSuccess, callbackFailed){
        return new Promise((resolve, reject) => {

            db.query("SELECT * FROM users WHERE login = ? LIMIT 1", [userLogin], (err, rows) => {
                if(err){
                    return reject(err);
                }
                
                let user = null;

                if(rows.length > 0){
                    user = User.Parse(rows[0]);
                } else {
                    return reject("User not found");
                }
                
                if(user !== null){
                    return resolve(user);
                } else {
                    return reject("User not found");
                }
            });

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

    authenticate(userLogin, userPass, userIP){
        return new Promise((resolve, reject) => {
            if(userLogin === undefined){
                return reject("User login is not provided");
            }

            if(userPass === undefined){
                return reject("User password is not provided");
            }

            let user = undefined;
            this.find(userLogin) // Find user
                .then((_user) => {
                    user = _user;
                    return passwordFactory.validate(user.getID(), userPass) // Check password
                })
                .then(() => {
                    return tokenFactory.generateToken(user.getID(), userIP)
                }) // Get token
                .then((token) => {
                    return resolve({
                        token: token
                    });
                })
                .catch((err) => {
                    return reject(err); // If any step was failed, return error
                });
        });
    }
}
module.exports = new userFactory();