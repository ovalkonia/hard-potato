import express from "express";

import auth_router from "./routes/auth.js";
import profile_router from "./routes/profile.js";
import lobby_router from "./routes/lobby.js";

const app = express();
const port = 8080;

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
app.get("profile/tutorial", (req, res) => {
    res.render("profile/tutorial");
});

app.get("/lobby/testgamepage", (req, res) => {
    res.render("lobby/testgamepage");
});
//--------------------------------------

app.use(auth_router);
app.use(profile_router);
app.use(lobby_router);

app.all("*any", (req, res) => {
    return res.render("404");
});

// Listen

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
