import express from "express";

import auth_user_middleware from "../middlewares/auth_user.js";

import profile_controller from "../controllers/profile.js";

const profile_router = express.Router();

profile_router.get("/profile/self", auth_user_middleware, profile_controller.get_self)
profile_router.post("/profile/self", auth_user_middleware, profile_controller.post_self);

profile_router.get("/profile/:usernamae", auth_user_middleware, profile_controller.get_profile);

export default profile_router;
