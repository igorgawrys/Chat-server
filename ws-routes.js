"use strict"
const WebSocket = require('ws');

class ConnectionsFactory {
    constructor() {
        this.connections = [];
    }

    find(userID){
        return this.connections[0];
    }

    add(webSocketConnection){
        this.connections.push(webSocketConnection);
    }
}

let connectionsFactory = new ConnectionsFactory();


module.exports = (socket) => {
    socket.on('connection', function connection(ws, req) {
        connectionsFactory.add(ws);
        ws.on('message', (data) => {
            connectionsFactory.find(1).send(data);
            connectionsFactory.find(2).send(data);
            ws.send(data);
        });
    });

}
