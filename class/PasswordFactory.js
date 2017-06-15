const db = require('../database');

let bcrypt = require('bcrypt');

class PasswordFactory {
    constructor() {
        this.passwords = [];
    }

    get(userID){
        for(let i in this.passwords){
            if(this.passwords[i].user === userID){
                return this.passwords[i];
            }
        }

        return null;
    }

    savePassword(userID, password){
        db.query('INSERT INTO passwords SET userID = ?, hash = ?', [userID, password]);
    }

    validate(userID, password, callbackSuccess, callbackFailed){
        db.query('SELECT hash FROM passwords WHERE userID = ?', [userID], (err, rows) => {
            if(err){
                console.error(err);
                callbackFailed("Cannot get user hash");
                return;
            }

            if(rows.length === 0){
                callbackFailed("User don't store his password");
                return;
            }

            if(bcrypt.compareSync(password, rows[0].hash)){
                callbackSuccess(rows[0].hash);
            } else {
                callbackFailed("Password is not match");
            }
        });
    }

    encrypt(password){
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);

        return hash;
    }
}

module.exports = new PasswordFactory();