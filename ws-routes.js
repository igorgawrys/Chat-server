"use strict"
const WebSocket = require('ws');
const UserFactory = require('./class/userFactory');

module.exports = (socket) => {
    socket.on('connection', function connection(ws, req) {
        ws.on('message', (data) => {
            data = JSON.parse(data);
            if(data.type === undefined){
                return;
            }

            switch(data.type){
                case 'register':
                    if(data.userID === undefined){
                        return;
                    }

                    let user = UserFactory.get(data.userID);

                    user.assignWebSocket(ws);
                    let friends = user.getFriends();


                    for(let i in friends){
                        let friendWS = UserFactory.get(friends[i]).ws;
                        if(friendWS === undefined){
                            return;
                        }

                        console.log(friendWS);

                        friendWS.send(JSON.stringify({
                            type: "user connected",
                            userID: data.userID
                        }));
                    }

                    break;
            }
        });

        ws.on('close', (data) => {
            if(data.userID === undefined){
                return;
            }

            let user = UserFactory.get(data.userID);

            user.assignWebSocket(undefined);
            let friends = user.getFriends();


            for(let i in friends){
                let friendWS = UserFactory.get(friends[i]).ws;
                if(friendWS === undefined){
                    return;
                }
                friendWS.send(JSON.stringify({
                    type: "user disconnected",
                    userID: data.userID
                }));
            }
        })
    });

}
