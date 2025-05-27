import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
import { startDotAnimation, stopDotAnimation } from './waiting.js';
import { showWaitingUI, hideWaitingUI, showGameUI, hideGameUI } from './waitingUI.js';
import { showEndOverlay } from './animations.js';
import { stopCircularTurnTimer, startCircularTurnTimer } from './timer.js';

import {
    getBattlefieldCardIds,
    renderOpponentNameAndAvatar,
    renderPlayerInfo,
    renderOpponentHealth,
    updateHealthTextures,
    updateHand,
    updateButtStatus,
    updateCardInteractivity,
    updateBattlefield
} from './game.js';

let my_turn;
const socket = io();

showWaitingUI(roomId);
startDotAnimation();

console.log(user_id);
console.log(deck);

socket.on("connect", () => {
    socket.emit('join', roomId);
});

socket.on("reconnect", () => {
    socket.emit("join", roomId);
});

socket.on("connect_error", (err) => {
    console.warn("Connection error:", err.message);
});

socket.on("disconnect", (reason) => {
    console.warn("Disconnected:", reason);
    hideGameUI();
    showWaitingUI(roomId);
    startDotAnimation();

    if (reason === "io server disconnect") {
        socket.connect();
    }
});

socket.on('start', (data) => {
    stopDotAnimation();
    hideWaitingUI();
    showGameUI();

    const opponentId = Object.keys(data)[0];
    const opponent = data[opponentId];
    my_turn = user_id === data.player;
    console.log("My turn:", my_turn);
    renderOpponentNameAndAvatar({
        name: opponent.username,
        avatar: opponent.avatar_id
    });
});

document.getElementById('end-turn').addEventListener('click', () => {
    const battlefieldCards = getBattlefieldCardIds();

    socket.emit('play', {
        battlefield: battlefieldCards
    });
});

socket.on('round', (data) => {
    const opponentId = Object.keys(data.players).find(id => id !== user_id);
    renderPlayerInfo(data.players[user_id]);
    renderOpponentHealth(data.players[opponentId]);
    updateHealthTextures(data.players);
    console.log("My turn:", my_turn);
    updateHand(data.players[user_id], my_turn);
    updateButtStatus(my_turn);
    if (my_turn) {
        startCircularTurnTimer(30, () => {
            const battlefieldCards = getBattlefieldCardIds();
            socket.emit('play', {
                battlefield: battlefieldCards
            });
        });
    } else {
        startCircularTurnTimer(30, () => {});
    }
});

socket.on('battlefield', (data) => {
    my_turn = !my_turn;
    console.log("My turn:", my_turn);
    const battlefield = data.battlefield;
    const opponentId = Object.keys(battlefield).find(id => id !== user_id);

    updateBattlefield(opponentId, battlefield);
    updateButtStatus(my_turn);
    updateCardInteractivity(my_turn);
});

socket.on('game', (data) => {
    stopCircularTurnTimer();

    const result = data.winner === user_id ? "win" : "lose";
    showEndOverlay(result);
});