const room_controller = {
    get_room: (req, res) => {
        return res.render("room/room", {
            code: req.params.code,
        });
    },
};

export default room_controller;
