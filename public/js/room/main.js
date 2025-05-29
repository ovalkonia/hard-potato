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
    updateBattlefield,
    showPopupMessage,
    clearBattlefield
} from './game.js';

let my_turn;
let battlefield_count = 0;
const socket = io();

showWaitingUI(roomId);
startDotAnimation();

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

    const opponent = data.opponent;
    my_turn = user_id === data.player;
    renderOpponentNameAndAvatar({
        name: opponent.username,
        avatar: opponent.avatar_id
    });
});

document.getElementById('end-turn').addEventListener('click', () => {
    stopCircularTurnTimer();
    const battlefieldCards = getBattlefieldCardIds();
    socket.emit('play', {
        battlefield: battlefieldCards
    });
});

socket.on('round', (data) => {
    clearBattlefield();
    renderPlayerInfo(data.players.me);
    renderOpponentHealth(data.players.opponent);
    updateHealthTextures(data.players);
    updateHand(data.players.me, my_turn);
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

    if (my_turn) {
        showPopupMessage("It's your turn!", 2000);
    } else {
        showPopupMessage(`Opponent's turn!`, 2000);
    }
});

socket.on('battlefield', (data) => {
    ++battlefield_count

    if (!my_turn) updateBattlefield(data.battlefield);
    if (battlefield_count !== 2) {
        my_turn = !my_turn;
            if (my_turn) {
            startCircularTurnTimer(30, () => {
                const battlefieldCards = getBattlefieldCardIds();
                socket.emit('play', {
                    battlefield: battlefieldCards
                });
            });
            showPopupMessage("It's your turn!", 2000);
        } else {
            showPopupMessage("Opponent's turn!", 2000);
            startCircularTurnTimer(30, () => {});
        }
    } else {
        battlefield_count = 0;
    }

    updateButtStatus(my_turn);
    updateCardInteractivity(my_turn);

});

socket.on('game', (data) => {
    stopCircularTurnTimer();

    const result = data.winner === user_id ? "win" : "lose";
    showEndOverlay(result);
    setTimeout(() => {
        window.location.href = '/profile/self';
    }, 5000);
});