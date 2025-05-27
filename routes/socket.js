import socket_controller from "../controllers/socket.js";

const socket_use = (io) => {
    io.on("connection", (socket) => {
        socket_controller.on_connection(io, socket);

        socket.on("join", (room_id) => socket_controller.on_join(io, socket, room_id));
        socket.on("play", (data) => socket_controller.on_play(io, socket, data));
        socket.on("disconnect", (data) => socket_controller.on_disconnect(io, socket, data));
    })
}

export default socket_use;
