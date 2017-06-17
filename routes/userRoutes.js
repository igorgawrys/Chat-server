'use strict'
let express = require('express');

const userFactory = require('../class/userFactory');

let router = express.Router();

router.route('/authenticate').post((req, res) => {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if(ip === "::1"){
            ip = "localhost";
        }

        userFactory.authenticate(req.body.login, req.body.password, ip)
        .then((response) => {
            res.send(response);
        })
        .catch((err) => {
            console.error(err);
            res.send(401, {
                error: err
            });            
        });
});


router.route('/logout').get((req, res) => {
});

router.route('/create').post((req, res) => {
    let userData = {
        login: req.body.login,
        password: req.body.password
    };

    userFactory.create(userData)
        .then((response) => {
            res.send(response);
        })
        .catch((err) => {
            console.error(err);
            res.send({
                error: err
            });
        });
});

router.route('/remove').post((req, res) => {
    userFactory.remove(req.body.userLogin)
        .then((response) => {
            res.send(response);
        })
        .catch((err) => {
            console.error(err);
            res.send({
                error: err
            });
        })
});

module.exports = router;