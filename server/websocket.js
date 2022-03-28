const socketio = require("socket.io");
const calculateDistance = require("./utils/calculateDistance");

let io;
const connections = [];

exports.setupWebsocket = (server) => {
    io = socketio(server);

    io.on("connection", (socket) => {
        console.log(socket.id);
        console.log(socket.handshake.query);

        const { latitude, longitude } = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude)
            }
        });
    });
};

exports.findConnections = (coordinates, distancia) => {
    console.log("Chegou no websockets findconnection");
    var d = new Date();
    d.setMonth(d.getMonth() - 3);
    console.log(d.toLocaleDateString());
    return connections.filter((connection) => {
        return (
            calculateDistance(coordinates, connection.coordinates) <
                distancia / 1000 && connection.ultimaDoacao < d
        );
    });
};

exports.sendMessage = (to, message, data) => {
    // console.log("to", to);
    console.log("message", message);
    // console.log("data", data);
    to.forEach((connection) => {
        io.to(connection.id).emit(message, data);
    });
};
