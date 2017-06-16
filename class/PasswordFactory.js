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
    validate(userID, password){
        return new Promise((resolve, reject) => {
            db.query('SELECT hash FROM passwords WHERE userID = ?', [userID], (err, rows) => {
                if(err){
                    return reject("Cannot get user hash");
                }

                if(rows.length === 0){
                    return reject("User don't store his password");
                }

                if(bcrypt.compareSync(password, rows[0].hash)){
                    return resolve();
                } else {
                    return reject("Password is not match");
                }
            });

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