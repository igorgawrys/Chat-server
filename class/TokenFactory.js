"use strict"
const db = require('../database');

const crypto = require('crypto');

class TokenFactory {
    
    // Generate and save new token
    generateToken(userID, userIP){
        return new Promise((resolve, reject) => {
            db.query('SELECT token FROM tokens WHERE userID = ? AND ip = ?', [userID, userIP], (err, rows) => {                
                if(err){
                    return reject(err);
                }

                if(rows.length > 0) {
                    return resolve(rows[0].token);
                }
                
                let token = crypto.randomBytes(256).toString('hex');
                db.query("INSERT INTO tokens SET userID = ?, token = ?, ip = ?", [userID, token, userIP], (err) => {
                    if(err){
                        return reject("Token was not generated");
                    }
                    return resolve(token);
                });
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