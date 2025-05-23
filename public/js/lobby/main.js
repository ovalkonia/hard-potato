import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
import { startDotAnimation, stopDotAnimation } from './waiting.js';
import { showWaitingUI, hideWaitingUI, showGameUI, hideGameUI } from './waitingUI.js';

const roomId = window.location.pathname.split('/').pop();
const socket = io();

startDotAnimation();
showWaitingUI(roomId);

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
