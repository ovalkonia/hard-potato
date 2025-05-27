import rooms_pool from "../databases/rooms_pool.js";

const socket_controller = {
    on_connection: async (io, socket) => {

    },
    on_join: async (io, socket, room_id) => {
        const user = socket.request.session.user;
        if (!user ||
            !await rooms_pool.room_exists(room_id) ||
            await rooms_pool.room_full(room_id)) {
            return;
        }

        await rooms_pool.players_add(room_id, user.id);
        socket.join(room_id);

        if (await rooms_pool.room_full(room_id)) {
            io.to(room_id).emit("start", rooms_pool[room_id]);
        }
    },
    on_message: (io, socket, message) => {
        console.log(`${socket.id}'S MESSAGE`);
        console.log(message);
        console.log(`${socket.id}'S ROOMS`);
        console.log(socket.rooms);
    },
    on_disconnect: (io, socket) => {
        console.log(`Disconnected, ${socket.id}`);
    },
};

export default socket_controller;
