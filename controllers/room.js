import rooms_pool from "../databases/rooms_pool.js";

const room_controller = {
    get_manage: (req, res,) => {
        return res.render("room/manage");
    },
    post_create: async (req, res) => {
        return res.json({
            room_id: await rooms_pool.room_create(),
        });
    },
    get_room: async (req, res, next) => {
        const room_id = req.params.room_id;
        if (!await rooms_pool.room_exists(room_id)) {
            return next();
        }

        return res.render("room/room", {
            user_id: req.session.user.id,
            username: req.session.user.username,
            avatar_id: req.session.user.avatar_id,
            room_id: room_id,
            deck: await rooms_pool.deck_get(room_id),
        });

    },
};

export default room_controller;
