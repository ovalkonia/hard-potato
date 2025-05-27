import rooms_pool from "../databases/rooms_pool.js";
import mysql_pool from "../databases/mysql_pool.js";
import UserSchema from "../schemas/UserSchema.js";
import UserModel from "../models/UserModel.js";
import UserModelException from "../models/UserModelException.js";
import MySQLModelAdapter from "../adapters/MySQLModelAdapter.js";
import FilterBuilder from "../utils/FilterBuilder.js";

async function get_players_sockets(io, client, room_id) {
    const sockets = await io.in(room_id).fetchSockets();

    return {
        me: client,
        opponent: sockets.find(socket => socket.id !== client.id),
    };
}

function get_users_ids(io, client, room_id) {
    const user_id = client.request.session.user.id;
    const player_ids = rooms_pool.players_get_ids(room_id);

    return {
        me: user_id,
        opponent: player_ids.find(id => id !== user_id),
    };
}

const socket_controller = {
    on_connection: async (io, client) => {
    },
    on_join: async (io, client, room_id) => {
        const user = client.request.session.user;
        if (!user ||
            !rooms_pool.room_exists(room_id) ||
            rooms_pool.room_full(room_id)) {
            return;
        }

        rooms_pool.players_add(room_id, user.id);
        rooms_pool.player_randomize(room_id);
        client.join(room_id);
        user.room_id = room_id;

        if (!rooms_pool.room_full(room_id)) return;

        let connection = await mysql_pool.getConnection();
        const model_adapter = new MySQLModelAdapter(connection, "users");

        const users_ids = get_users_ids(io, client, room_id);
        const users = {
            me: await UserModel.get_first_filter(model_adapter, FilterBuilder.where("id", "=", users_ids.me)),
            opponent: await UserModel.get_first_filter(model_adapter, FilterBuilder.where("id", "=", users_ids.opponent)),
        };

        connection.release();

        const players_sockets = await get_players_sockets(io, client, room_id);
        players_sockets.me.emit("start", {
            player: rooms_pool.player_get(room_id),
            opponent: {
                username: users.opponent.username,
                avatar_id: users.opponent.avatar_id,
            },
        });
        players_sockets.opponent.emit("start", {
            player: rooms_pool.player_get(room_id),
            opponent: {
                username: users.me.username,
                avatar_id: users.me.avatar_id,
            },
        });

        players_sockets.me.emit("round", {
            players: {
                me: rooms_pool.players_get_private(room_id, users_ids.me),
                opponent: rooms_pool.players_get_public(room_id, users_ids.opponent),
            },
        });
        players_sockets.opponent.emit("round", {
            players: {
                me: rooms_pool.players_get_private(room_id, users_ids.opponent),
                opponent: rooms_pool.players_get_public(room_id, users_ids.me),
            },
        });
    },
    on_play: (io, client, data) => {
        const user = client.request.session.user;
        const room_id = data.room_id;

        // if (!user ||
        //     !room_id ||
        //     await rooms_pool.room_contains_player()
        //     await rooms_pool.room_full(room_id)) {
        //     return;
        // }
    },
    on_disconnect: (io, client) => {
        console.log(`Disconnected, ${client.id}`);
    },
};

export default socket_controller;
