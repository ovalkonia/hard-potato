import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
import { startDotAnimation, stopDotAnimation } from './waiting.js';
import { setupStartButton, showWaitingUI, hideWaitingUI, showGameUI } from './waitingUI.js';

const roomId = window.location.pathname.split('/').pop();
document.getElementById('room-code').textContent = roomId;
document.getElementById('copy-button').addEventListener('click', copyRoomCode);

function copyRoomCode() {
    const code = document.getElementById('room-code').textContent;
    navigator.clipboard.writeText(code).then(() => alert('Room code copied!'));
}

const savedOffset = localStorage.getItem('serverOffset');
const socket = io({ auth: { serverOffset: savedOffset ? Number(savedOffset) : 0 } });

setupStartButton(socket, { startDotAnimation, stopDotAnimation });

startDotAnimation();
showWaitingUI();

socket.on("connect", () => {
    socket.emit('joinGame', { serverOffset: socket.auth.serverOffset || 0 });
});

socket.on("reconnect", (attempt) => {
    console.log("Reconnected after", attempt, "attempts");
    socket.emit("joinGame", { serverOffset: socket.auth.serverOffset || 0 });
});

socket.on("connect_error", (err) => console.warn("Connection error:", err.message));

socket.on("disconnect", (reason) => {
    console.warn("Disconnected:", reason);
    startDotAnimation();
    if (reason === "io server disconnect") {
        socket.connect();
    }
});

socket.on('gameStart', (data, serverOffset) => {
    stopDotAnimation();
    hideWaitingUI();
    showGameUI();

    socket.auth.serverOffset = serverOffset;
    localStorage.setItem('serverOffset', serverOffset);

    renderGame(data);
});
