import rooms_pool from "../databases/rooms_pool.js";

const room_controller = {
    put_room: (req, res) => {
        return res.seind("Didn't ask");
    },
    get_room: (req, res) => {
        return res.render("room/room", {
            code: req.params.code,
        });
    },
};

export default room_controller;
