import express from "express";

import room_controller from "../controllers/room.js";

const room_router = express.Router();

room_router.get("/room/:id", room_controller.get_room);

export default room_router;
