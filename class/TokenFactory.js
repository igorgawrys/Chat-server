"use strict"
const db = require('../database');

const crypto = require('crypto');

class TokenFactory {    
    insert(userID, token, userIP){
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO tokens SET userID = ?, token = ?, ip = ?", [userID, token, userIP], (err) => {
                if(err){
                    return reject("Token was not generated");
                }
                return resolve();
            });
        });
    }

    get(userID, userIP){
        return new Promise((resolve, reject) => {
            db.query('SELECT token FROM tokens WHERE userID = ? AND ip = ? LIMIT 1', [userID, userIP], (err, rows) => {                
                if(err){
                    return reject(err);
                }

                if(rows.length > 0) {
                    return resolve(rows[0].token);
                }
                

                return resolve(null);                
            });
        });
    }

    // Generate and save new token
    generateToken(userID, userIP){
        process.env.requestsCount++;
        return new Promise((resolve, reject) => {
            this.get(userID, userIP)
                .then((token) => {
                    if(token !== null){
                        return resolve(token);
                    }

                    token = crypto.randomBytes(256).toString('hex');
                    return this.insert(userID, token, userIP);
                })
                .then(() => {
                    return this.get(userID, userIP);
                })
                .then((token) => {
                    if(token !== null){
                        return resolve(token);
                    }

                    return reject("Cannot generate token");
                })
                .catch((err) => {
                    return reject(err);
                });
        });
    }

    remove(userID) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM tokens WHERE userID = ?', [userID], (err, rows) => {
                if(err){
                    return reject(err);
                }
                return resolve();
            });
        })
    }
}

module.exports = new TokenFactory();