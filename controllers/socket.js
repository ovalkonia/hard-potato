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
        if (!user) return;
        if (!rooms_pool.room_exists(room_id) ||
            rooms_pool.room_full(room_id)) {
            return;
        }

        rooms_pool.players_add(room_id, user.id);
        client.join(room_id);
        user.room_id = room_id;

        if (!rooms_pool.room_full(room_id)) return;

        rooms_pool.player_randomize(room_id);

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

        rooms_pool.mana_restore(room_id);
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
    on_play: async (io, client, data) => {
        // Check if the session exists

        const user = client.request.session.user;
        if (!user) return;

        // Check is it's user's turn

        const user_id = user.id;
        const room_id = user.room_id;
        if (!rooms_pool.room_exists(room_id) ||
            rooms_pool.player_get(room_id) !== String(user.id)) {
            return;
        }

        // Play cards

        rooms_pool.hand_play(room_id, user_id, data.battlefield);

        // Send updated battlefield

        const players_sockets = await get_players_sockets(io, client, room_id);
        const users_ids = get_users_ids(io, client, room_id);

        const battlefield = rooms_pool.battlefield_get(room_id);

        players_sockets.me.emit("battlefield", {
            battlefield: {
                me: battlefield[users_ids.me],
                opponent: battlefield[users_ids.opponent],
            },
        });
        players_sockets.opponent.emit("battlefield", {
            battlefield: {
                me: battlefield[users_ids.opponent],
                opponent: battlefield[users_ids.me],
            },
        });

        // Check if it's battle time

        if (!rooms_pool.battlefield_full(room_id)) {
            rooms_pool.player_swap(room_id);
            return;
        }

        rooms_pool.round_play(room_id);
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
    on_disconnect: (io, client) => {
        console.log(`Disconnected, ${client.id}`);
    },
};

export default socket_controller;
