import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

const savedOffset = localStorage.getItem('serverOffset');

const socket = io({
    auth: {
        serverOffset: savedOffset ? Number(savedOffset) : 0
    }
});

let waitingModule = null;
// import('./waiting.js').then(mod => {
//     waitingModule = mod;
//     waitingModule.startDotAnimation();
// });

import('./waiting.js').then(mod => {
    waitingModule = mod;
    waitingModule.startDotAnimation();

    document.querySelector('.waiting-container').style.display = 'flex';
    
    setTimeout(() => {
        waitingModule.stopDotAnimation();

        document.querySelector('.waiting-container').style.display = 'none';
        document.getElementById('game-ui').style.display = 'block';
    }, 30000);
});

socket.on("connect", () => {
    socket.emit('joinGame', { serverOffset: socket.auth.serverOffset || 0 });
});

socket.on("reconnect", (attempt) => {
    console.log("Reconnected after", attempt, "attempts");
    socket.emit("joinGame", { serverOffset: socket.auth.serverOffset || 0 });
});

socket.on("connect_error", (err) => {
    console.warn("Connection error:", err.message);
});

socket.on("disconnect", (reason) => {
    console.warn("Disconnected:", reason);
    if (waitingModule) {
        waitingModule.startDotAnimation();
    }

    if (reason === "io server disconnect") {
        socket.connect();
    }
});

socket.on('gameStart', (data, serverOffset) => {
    if (waitingModule) {
        waitingModule.stopDotAnimation();
    }

    document.querySelector('.waiting-container').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';

    socket.auth.serverOffset = serverOffset;
    localStorage.setItem('serverOffset', serverOffset);

    renderGame(data);
});
