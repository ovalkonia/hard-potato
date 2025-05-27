import { createServer } from "http";

import express from "express";

import express_session from "./services/express_session.js";
import socket_service from "./services/socket.js";

import socket_use from "./routes/socket.js";
import auth_router from "./routes/auth.js";
import profile_router from "./routes/profile.js";
import room_router from "./routes/room.js";

const port = 8080;
const app = express();
const http_server = createServer(app);
const socket_server = socket_service.initialize(http_server, {
    cors: {
        origin: "*",
    },
});
socket_server.engine.use(express_session);

socket_use(socket_server);

// Sets

app.set("view engine", "ejs");

// Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express_session);

app.get("/", (req, res) => {
    return res.render("index");
});

app.get("/tutorial", (req, res) => {
    return res.render("tutorial");
});

app.use(auth_router);
app.use(profile_router);
app.use(room_router);

app.all("*any", (req, res) => {
    return res.render("404");
});

// Listen

http_server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

