let passwordFactory = require('./PasswordFactory');
let userNextID = 1;

class User {
    constructor(userData){
        this.login = userData.login;
        this.id = userNextID++;
    }

    getID(){
        return this.id;
    }

    getLogin(){
        return this.login;
    }

    static Parse(userData){
        if(userData.login === undefined){
            return false;
        }
        let user = new User(userData);
        passwordFactory.generatePassword(user.id, userData.password);

        return user;
    }

}

module.exports = User;