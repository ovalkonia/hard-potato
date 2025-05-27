import { v4 as uuidv4 } from 'uuid';

import CardModel from '../models/CardModel.js';
import MySQLModelAdapter from '../adapters/MySQLModelAdapter.js';
import mysql_pool from './mysql_pool.js';

const rooms_pool = {};

rooms_pool.room_exists = async (room_id) => {
    return rooms_pool[room_id] !== undefined;
};

rooms_pool.room_full = async (room_id) => {
    return Object.keys(rooms_pool[room_id].players).length >= 2;
};

rooms_pool.room_get_round = async (room_id) => {
    return rooms_pool[room_id].round;
};

rooms_pool.players_get_public = (room_id, player_id) => {
    const player = rooms_pool[room_id].players[player_id];

    return {
        defense: player.defense,
        mana: player.mana,
    };
};

rooms_pool.players_get_private = async (room_id, player_id) => {
    const player = rooms_pool[room_id].players[player_id];

    return {
        defense: player.defense,
        mana: player.mana,
        hand: player.hand,
    };
};

rooms_pool.battlefield_get = async (room_id) => {
    return rooms_pool[room_id].battlefield;
};

rooms_pool.deck_get = async (room_id) => {
    return rooms_pool[room_id].deck;
};

rooms_pool.room_create = async () => {
    let connection = await mysql_pool.getConnection();
    const model_adapter = new MySQLModelAdapter(connection, "cards");
    const room = {
        round: 0,
        player: null,
        players: {},
        battlefield: {},
        deck: await CardModel.get_all_filter(model_adapter),
    };
    const id = uuidv4();

    rooms_pool[id] = room;
    connection.release();

    return id;
};

rooms_pool.players_add = async (room_id, player_id) => {
    const player = {
        defense: 30,
        mana: 5,
        hand: [],
    };

    rooms_pool[room_id].players[player_id] = player;
    rooms_pool[room_id].battlefield[player_id] = [];

    return player_id;
};

rooms_pool.player_randomize = async (room_id) => {
    const player_ids = Object.keys(rooms_pool[room_id].players);

    rooms_pool[room_id].player = player_ids[Math.floor(Math.random() * player_ids.length)];
};

rooms_pool.mana_restore = async (room_id, player_id) => {
    const round = rooms_pool[room_id].round;
    const player = rooms_pool[room_id].players[player_id];

    player.mana += 2 + 2 * round;
};

rooms_pool.hand_fill = (room, player_id) => {
    const deck = rooms_pool[room].deck;
    const player = rooms_pool[room].players[player_id];

    player.hand = deck.toSorted(() => Math.random() - 0.5).map(card => card.id).slice(0, 3);
};

rooms_pool.hand_play = async (room_id, player_id, card_ids) => {
    const deck = rooms_pool[room_id].deck;
    const player = rooms_pool[room_id].players[player_id];
    const hand = player.hand;

    for (let i = 0; i < card_ids.length; ++i) {
        for (let j = 0; j < hand.length; ++j) {
            if (hand[j] === card_ids[i]) {
                rooms_pool[room_id].battlefield[player_id].push(card_ids[i]);
                player.mana -= deck.find(card => card.id === card_ids[i]).cost;
                hand.splice(j, 1);
            }
        }
    }
};

rooms_pool.battle = async (room_id) => {
    const player_ids = Object.keys(rooms_pool[room_id].players);
    const battlefield = rooms_pool[room_id].battlefield;
    const deck = rooms_pool[room_id].deck;

    const results = {};
    results[player_ids[0]] = battlefield[player_ids[0]]
        .map(card_id => deck.find(card => card.id === card_id))
        .reduce((result, card) => {
            result.attack += card.attack;
            result.defense += card.defense;

            return result;
        }, {
            attack: 0,
            defense: 0,
        });
    results[player_ids[1]] = battlefield[player_ids[1]]
        .map(card_id => deck.find(card => card.id === card_id))
        .reduce((result, card) => {
            result.attack += card.attack;
            result.defense += card.defense;

            return result;
        }, {
            attack: 0,
            defense: 0,
        });

    rooms_pool[room_id].players[player_ids[0]].defense -= Math.max(
        results[player_ids[1]].attack - results[player_ids[0]].defense,
        0
    );
    rooms_pool[room_id].players[player_ids[1]].defense -= Math.max(
        results[player_ids[0]].attack - results[player_ids[1]].defense,
        0
    );
};

rooms_pool.battlefield_clear = async (room_id) => {
    const player_ids = Object.keys(rooms_pool[room_id].players);
    rooms_pool[room_id].battlefield[player_ids[0]] = [];
    rooms_pool[room_id].battlefield[player_ids[1]] = [];
};

rooms_pool.player_swap = async (room_id) => {
    const room = rooms_pool[room_id];
    const players = Object.keys(rooms_pool[room_id].players);

    switch (room.player) {
        case players[0]:
            room.player = players[1];
            break;
        case players[1]:
            room.player = players[0];
            break;
        default:
            break;
    }
};

export default rooms_pool;
