const socket_controller = {
    on_connection: (socket) => {
        console.log(`Connected, ${socket.id}`);
    },
    on_join: (socket, room) => {
        socket.join(room);
        console.log(`${socket.id}'S JOINED ${room}`);
    },
    on_message: (socket, message) => {
        console.log(`${socket.id}'S MESSAGE`);
        console.log(message);
        console.log(`${socket.id}'S ROOMS`);
        console.log(socket.rooms);
    },
    on_disconnect: (socket) => {
        console.log(`Disconnected, ${socket.id}`);
    },
};

export default socket_controller;
