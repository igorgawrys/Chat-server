"use strict"
const userFactory = require('./class/userFactory');

module.exports = (app) => {

    app.get('/', (req, res) => {
        res.send({
            message: 'Api works!'
        });
    });


    // User routes
    app.get('/users/:userID', (req, res) => {
        let userID = req.params.userID;
        
        if(parseInt(userID)){
            userFactory.get(userID, (user) => {
                res.send(user);
            }, (err) => {
                res.send(err);
            });
        } else {
            userFactory.find(userID, (user) => {
                res.send(user);
            }, (err) => {
                res.send({
                    error: err
                });
            });
        }
    });

    // Authenticate user
    app.post('/users/authenticate', (req, res) => {
        if(req.body === undefined || req.body.login === undefined || req.body.password === undefined){
            res.send({
                error: "Login or password is not provided"
            });
            return;
        }


        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if(ip === "::1"){
            ip = "localhost";
        }

        let userData = {
            ip: ip,
            login: req.body.login,
            password: req.body.password
        };

        userFactory.authenticate(userData, (data) => {
            res.send(data);
        }, (err) => {
            res.send({
                error: err
            });
        });
    });
}