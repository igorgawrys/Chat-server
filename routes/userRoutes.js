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
            res.send({
                error: err
            });            
        });
});


router.route('/logout').get((req, res) => {
});

module.exports = router;