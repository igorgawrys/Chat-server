const db = require('../database');

let bcrypt = require('bcrypt');

class PasswordFactory {

    // Save new password in db
    savePassword(userID, password){
        db.query('INSERT INTO passwords SET userID = ?, hash = ?', [userID, password], (err) => {
            if(err){
                console.error(err);
            }
        });
    }


    // Validate user password
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

    // Encrypt user password
    encrypt(password){
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);

        return hash;
    }
}

module.exports = new PasswordFactory();