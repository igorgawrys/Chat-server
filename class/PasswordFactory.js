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

    generatePassword(userID, password){
        this.passwords.push({
            user: userID,
            hash: this.encrypt(password)
        });
    }

    validate(userID, password){
        return bcrypt.compareSync(password, this.get(userID).hash);
    }

    encrypt(password){
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);

        return hash;
    }
}

module.exports = new PasswordFactory();