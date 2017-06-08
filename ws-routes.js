"use strict"
const WebSocket = require('ws');

class ConnectionsFactory {
    constructor() {
        this.connections = [];
    }

    getCount(){
        return this.connections.length;
    }

    find(userID){
        return this.connections[0];
    }

    add(webSocketConnection){
        this.connections.push(webSocketConnection);
    }

    remove(webSocketConnection){
        let index = this.connections.indexOf(webSocketConnection);
        if(index > -1){
            this.connections.splice(index, 1);
        }
    }
}

let connectionsFactory = new ConnectionsFactory();


module.exports = (socket) => {
    socket.on('connection', function connection(ws, req) {

        connectionsFactory.add(ws);
        ws.on('message', (data) => {

            console.log(data);
        });

        ws.on('close', (data) => {
            connectionsFactory.remove(ws);
        })
    });

}
