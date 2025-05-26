import express from "express";

import auth_controller from "../controllers/auth.js";

const auth_router = express.Router();

auth_router.get("/auth/login{/:username}", auth_controller.get_login);
auth_router.post("/auth/login", auth_controller.post_login);

auth_router.get("/auth/register", auth_controller.get_register);
auth_router.post("/auth/register", auth_controller.post_register);

export default auth_router;
