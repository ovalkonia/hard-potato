import express from "express";

import auth_user_middleware from "../middlewares/auth_user.js";

import room_controller from "../controllers/room.js";

const room_router = express.Router();

room_router.put("/room/create", auth_user_middleware, room_controller.put_room);
room_router.get("/room/:id", auth_user_middleware, room_controller.get_room);

export default room_router;
