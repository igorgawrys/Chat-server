"use strict"
const WebSocket = require('ws');
const UserFactory = require('./class/userFactory');

class ConnectionsFactory {
    constructor() {
        this.connections = [];
    }

    getCount(){
        return this.connections.length;
    }

    find(userID){
        for(let i in this.connections){
            if(this.connections[i].userID === userID){
                return this.connections[i];
            }
        }

        return undefined;
    }

    findByWS(ws){
        for(let i in this.connections){
            if(this.connections[i].ws === ws){
                return this.connections[i];
            }
        }

        return undefined;
    }

    add(webSocketConnection){
        this.connections.push(webSocketConnection);
    }

    remove(webSocketConnection){
        let ws = this.findByWS(webSocketConnection);
        if(ws !== undefined){
            let user = JSON.parse(JSON.stringify(ws.userID)); // Simple clone
            let index = this.connections.indexOf(ws);
            this.connections.splice(index, 1);

            return user;
        }
    }
}

let connectionsFactory = new ConnectionsFactory();


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

                    connectionsFactory.add({
                        userID: data.userID,
                        ws: ws
                    });

                    // console.log(data.userID + " connected, now WS contains " + connectionsFactory.getCount() + " active connections");

                    {
                        let user =  UserFactory.get(data.userID);
                        let friends = user.getFriends();
                        for(let i in friends){
                            let friend = connectionsFactory.find(friends[i]);
                            if(friend !== undefined){
                                friend.ws.send(JSON.stringify({
                                    type: "user connected",
                                    userID: data.userID
                                }));
                            }
                        }
                    }

                    let activeUsers = [];
                        let user = connectionsFactory.find(data.userID);
                        if(user !== undefined){
                            let friends = UserFactory.get(data.userID).friends;
                            for(let i in friends){
                                let friend = connectionsFactory.find(friends[i]);
                                if(friend !== undefined){
                                    activeUsers.push(friend.userID);
                                }
                            }
                        }

                        ws.send(JSON.stringify({
                            type: 'active users list',
                            activeUsers: activeUsers
                        }));

                    break;

                case 'new message':
                    if(data.to === undefined || data.conversationID === undefined){
                        return;
                    }

                    for(let i in data.to){
                        let user = connectionsFactory.find(data.to[i]);
                        if(user !== undefined){
                            user.ws.send(JSON.stringify({
                                type: 'update',
                                conversationID: data.conversationID
                            }));
                        }
                    }
                    break;
            }
        });

        ws.on('close', (data) => {
            let user = connectionsFactory.remove(ws);
            let friends = UserFactory.get(user).friends;
            for(let i in friends){
                let friend = connectionsFactory.find(friends[i]);
                if(friend !== undefined){
                    friend.ws.send(JSON.stringify({
                        type: 'user disconnected',
                        userID: user
                    }));
                }
            }
            // console.log(user + " disconnected, now WS contains " + connectionsFactory.getCount() + " active connections");
        })
    });

}
