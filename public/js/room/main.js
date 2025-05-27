import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
import { startDotAnimation, stopDotAnimation } from './waiting.js';
import { showWaitingUI, hideWaitingUI, showGameUI, hideGameUI } from './waitingUI.js';
import { renderGame, getBattlefieldCardIds, updateCardInteractivity } from './game.js';
import { setGlobals } from './globals.js';

const roomId = window.location.pathname.split('/').pop();
const socket = io();

showWaitingUI(roomId);
startDotAnimation();

const deck = window.deck;
const user_id = window.user_id;
setGlobals(deck, user_id);

socket.on("connect", () => {
    socket.emit('join');
});

socket.on("reconnect", () => {
    socket.emit("join");
});

socket.on("connect_error", (err) => {
    console.warn("Connection error:", err.message);
});

socket.on("disconnect", (reason) => {
    console.warn("Disconnected:", reason);
    hideGameUI();
    showWaitingUI();
    startDotAnimation();

    if (reason === "io server disconnect") {
        socket.connect();
    }
});

socket.on('start', (data) => {
    stopDotAnimation();
    hideWaitingUI();
    showGameUI();

    renderGame(data);
});

document.getElementById('end-turn').addEventListener('click', () => {
    const battlefieldCards = getBattlefieldCardIds();

    socket.emit('end_turn', {
        cards: battlefieldCards
    });
});

socket.on('end-turn', (data) => {
    const opponentId = Object.keys(data.players).find(id => id !== user_id);
    updateButtStatus(data.player === user_id);
    updateBattlefield(opponentId, data.battlefield);
    updateCardInteractivity(data.player === user_id);
});