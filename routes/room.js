import express from "express";

import auth_user_middleware from "../middlewares/auth_user.js";

import room_controller from "../controllers/room.js";

const room_router = express.Router();

room_router.get("/room/manage", auth_user_middleware, room_controller.get_manage);
room_router.post("/room/create", auth_user_middleware, room_controller.post_create);
room_router.get("/room/:room_id", auth_user_middleware, room_controller.get_room);

export default room_router;
