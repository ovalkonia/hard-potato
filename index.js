import { createServer } from "http";

import express from "express";

import socket_service from "./services/socket.js";

import socket_use from "./routes/socket.js";
import auth_router from "./routes/auth.js";
import room_router from "./routes/room.js";

const port = 8080;
const app = express();
const http_server = createServer(app);
const socket_server = socket_service.initialize(http_server, {
    cors: {
        origin: "*",
    },
});

socket_use(socket_server);

// Sets

app.set("view engine", "ejs");

// Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    return res.render("index");
});

//For testing -------------------------
app.get("/tutorial", (req, res) => {
    res.render("tutorial");
});

app.get("/home", (req, res) => {
    res.render("home");
});
//--------------------------------------

app.use(auth_router);
app.use(room_router);

app.all("*any", (req, res) => {
    return res.render("404");
});

// Listen

http_server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
