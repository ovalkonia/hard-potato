import rooms_pool from "../databases/rooms_pool.js";

const socket_controller = {
    on_connection: async (socket) => {
        console.log(rooms_pool);

        console.log("---------------------------------------------");

        const room = await rooms_pool.room_create();
        console.log(`ROOM CREATED: ${room}`);
        console.log("ROOMS");
        console.dir(rooms_pool, { depth: 5 });

        console.log("---------------------------------------------");

        const player_a = "ziliboba";
        const player_b = "pivom";

        console.log(`PLAYER ADDED: ${await rooms_pool.players_add(room, player_a)}`);
        console.log(`PLAYER ADDED: ${await rooms_pool.players_add(room, player_b)}`);
        console.log("ROOMS");
        console.dir(rooms_pool, { depth: 5 });

        console.log("---------------------------------------------");

        rooms_pool.hand_fill(room, player_a);
        console.log(`${player_a}'S HAND FILLED`);
        console.log("ROOMS");
        console.dir(rooms_pool, { depth: 5 });

        rooms_pool.hand_fill(room, player_b);
        console.log(`${player_b}'S HAND FILLED`);
        console.log("ROOMS");
        console.dir(rooms_pool, { depth: 5 });

        console.log("---------------------------------------------");

        const player_a_cards = [...(await rooms_pool.players_get_private(room, player_a)).hand];
        const player_b_cards = [...(await rooms_pool.players_get_private(room, player_b)).hand];

        rooms_pool.hand_play(room, player_a, player_a_cards);
        console.log(`PLAYER ${player_a} PLAYED ${player_a_cards}`);
        console.log("ROOMS");
        console.dir(rooms_pool, { depth: 5 });

        rooms_pool.hand_play(room, player_b, player_b_cards);
        console.log(`PLAYER ${player_b} PLAYED ${player_b_cards}`);
        console.log("ROOMS");
        console.dir(rooms_pool, { depth: 5 });

        console.log("---------------------------------------------");

        console.log("BATTLING...");
        rooms_pool.battle(room);
        console.log("ROOMS");
        console.dir(rooms_pool, { depth: 5 });

        console.log("---------------------------------------------");

        console.log("CLEARING...");
        rooms_pool.battlefield_clear(room);
        console.log("ROOMS");
        console.dir(rooms_pool, { depth: 5 });

        console.log("---------------------------------------------");

        console.log("COIN TOSS...");
        rooms_pool.player_randomize(room);
        console.log("ROOMS");
        console.dir(rooms_pool, { depth: 5 });

        console.log("---------------------------------------------");

        console.log("TURNING...");
        rooms_pool.player_swap(room);
        console.log("ROOMS");
        console.dir(rooms_pool, { depth: 5 });

        console.log("---------------------------------------------");

        console.log("TURNING...");
        rooms_pool.player_swap(room);
        console.log("ROOMS");
        console.dir(rooms_pool, { depth: 5 });

        console.log("---------------------------------------------");
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
