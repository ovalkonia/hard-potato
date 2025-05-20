import express from "express";

import auth_router from "./routes/auth.js";

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
app.get("/tutorial", (req, res) => {
    res.render("tutorial");
});

app.get("/profile/home", (req, res) => {
    res.render("profile/home");
});

app.get("/lobby/testgamepage", (req, res) => {
    res.render("lobby/testgamepage");
});
//--------------------------------------

app.use(auth_router);

app.all("*any", (req, res) => {
    return res.render("404");
});

// Listen

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
