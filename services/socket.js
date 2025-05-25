import { Server } from "socket.io";

const socket_service = {
    initialize: (server, options = {}) => {
        return new Server(server, options);
    }
};

export default socket_service;
