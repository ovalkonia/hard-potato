const socket = io();

socket.emit("join", "roomhash");
socket.emit("message", "beep boop");
