import socket_controller from "../controllers/socket.js";

const socket_use = (io) => {
    io.on("connection", (socket) => {
        socket_controller.on_connection(socket);

        socket.on("join", (data) => socket_controller.on_join(socket, data));
        socket.on("message", (data) => socket_controller.on_message(socket, data));
        socket.on("disconnect", (data) => socket_controller.on_disconnect(socket, data));
    })
}

export default socket_use;
