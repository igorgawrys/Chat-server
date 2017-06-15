"use strict"
const db = require('../database');

const crypto = require('crypto');

class TokenFactory {
    
    // Generate and save new token
    generateToken(userID, userIP, callbackSuccess, callbackFailed){
        db.query('SELECT token FROM tokens WHERE userID = ? AND ip = ?', [userID, userIP], (err, rows) => {
            if(err){
                callbackFailed(err);
                return;
            }

            if(rows.length > 0) {
                callbackSuccess(rows[0].token);
                return;
            }
            
            let token = crypto.randomBytes(256).toString('hex');
            db.query("INSERT INTO tokens SET userID = ?, token = ?, ip = ?", [userID, token, userIP], (err) => {
                if(err){
                    console.log(err);
                    callbackFailed("Token is not generated");
                    return;
                }
                callbackSuccess(token);
            });
        });
    }
}

module.exports = new TokenFactory();