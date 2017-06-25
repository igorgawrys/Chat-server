'use strict'

const db = require('../database');
let tokenFactory = require('./TokenFactory');
let passwordFactory = require('./PasswordFactory');

class userFactory {

    // Find user in db by user login
    find(userLogin){
        return new Promise((resolve, reject) => {

            db.query("SELECT userID, login as userLogin FROM users WHERE login = ? LIMIT 1", [userLogin], (err, rows) => {
                if(err){
                    return reject("Failed to execute find");
                }
                
                let user = null;

                if(rows.length > 0){
                    return resolve(rows[0]);
                } else {
                    return reject("User not found");
                }
            });

        });
    }

    getID(userToken){
        return new Promise((resolve, reject) => {
            db.query("SELECT users.userID FROM users JOIN tokens on tokens.userID = users.userID WHERE token = ?", [userToken], (err, rows) => {
                if(err){
                    return reject(err);
                }

                if(rows.length > 0){
                    return resolve(rows[0].userID);
                } else {
                    return reject("Token expired");
                }
            });
        });
    }

    checkIfExists(userLogin){
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM users WHERE login = ? LIMIT 1", [userLogin], (err, rows) => {
                if(err){
                    return reject("Failed to execute checkIfExists");
                }
                
                if(rows.length > 0){
                    return reject("User already exists");
                }

                return resolve();
            });

        });
    }

    delete(userID) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM users WHERE userID = ?', [userID], (err, rows) => {
                if(err){
                    return reject("Failed to execute delete");
                }
                return resolve("User removed");
            });
        })
    }

    insert(userLogin){
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO users SET login = ?', [userLogin], (err) => {
                if(err){
                    return reject("Failed to execute insert");
                }

                return resolve();                      
            });
        });
    }

    // Create new user
    create(userData){
        return new Promise((resolve, reject) => {
            if(userData.login === undefined){
                return reject("User login is empty");
            }

            if(userData.password === undefined){
                return reject("User password is empty");
            }

            this.checkIfExists(userData.login)
                .then(() => {
                    return this.insert(userData.login);
                })
                .then(() => {
                    return this.find(userData.login);
                })
                .then((user) => {
                    let hash = passwordFactory.encrypt(userData.password);
                    return passwordFactory.savePassword(user.userID, hash);
                })
                .then(() => {
                    return resolve("User successfully created!");
                })
                .catch((err) => {
                    return reject(err);
                });
        });
    }

    remove(userLogin) {   
        let userID = undefined;
        return new Promise((resolve, reject) => {
            this.find(userLogin)
                .then((user) => {
                    userID = user.userID;
                    return tokenFactory.remove(userID);
                })
                .then(() => {
                    return passwordFactory.remove(userID);
                })
                .then(() => {
                    return this.delete(userID);
                })
                .then(() => {
                    return resolve("User successfully removed");
                })
                .catch((err) => {
                    return reject(err);
                })
        });
    }

    authenticate(userLogin, userPass, userIP){
        return new Promise((resolve, reject) => {
            if(userLogin === undefined){
                return reject("User login is not provided");
            }

            if(userPass === undefined){
                return reject("User password is not provided");
            }

            let userData = undefined;
            this.find(userLogin) // Find user
                .then((_user) => {
                    userData = _user;
                    return passwordFactory.validate(userData.userID, userPass) // Check password
                })
                .then(() => {
                    return tokenFactory.generateToken(userData.userID, userIP)
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