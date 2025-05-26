import rooms_pool from "../databases/rooms_pool.js";

const room_controller = {
    get_roompage: (req, res,) => {
        return res.render("room/roompage");
    },
    get_testgamepage: (req, res) => {
        return res.render("room/testgamepage", {
            avatar_id: 1,
            user_id: 1,
            username: "bebrik",
            deck: [
                { id: 1, name: 'Bloomerang', cost: 2, attack: 2, defense: 2 },
                { id: 2, name: 'Bonk Choy', cost: 6, attack: 6, defense: 4 },
                { id: 3, name: 'Cabbage-pult', cost: 5, attack: 5, defense: 3 },
                { id: 4, name: 'Cactus', cost: 2, attack: 2, defense: 2 },
                { id: 5, name: 'Cherry Bomb', cost: 5, attack: 2, defense: 6 },
                { id: 6, name: 'Chilly Pepper', cost: 2, attack: 2, defense: 2 },
                {
                    id: 7,
                    name: 'Fire Peashooter',
                    cost: 4,
                    attack: 4,
                    defense: 2
                },
                { id: 8, name: 'Jalapeno', cost: 3, attack: 4, defense: 1 },
                { id: 9, name: 'Kernel-pult', cost: 3, attack: 3, defense: 1 },
                { id: 10, name: 'Magnet-shroom', cost: 4, attack: 3, defense: 4 },
                { id: 11, name: 'Peashooter', cost: 4, attack: 3, defense: 5 },
                { id: 12, name: 'Potato Mine', cost: 1, attack: 1, defense: 1 },
                { id: 13, name: 'Puff-shroom', cost: 3, attack: 3, defense: 2 },
                { id: 14, name: 'Snapdragon', cost: 3, attack: 3, defense: 3 },
                { id: 15, name: 'Snow Pea', cost: 2, attack: 2, defense: 3 },
                { id: 16, name: 'Spikerock', cost: 1, attack: 1, defense: 2 },
                { id: 17, name: 'Sunflower', cost: 4, attack: 2, defense: 5 },
                { id: 18, name: 'Tall-nut', cost: 3, attack: 1, defense: 6 },
                { id: 19, name: 'Threepeater', cost: 3, attack: 3, defense: 2 },
                { id: 20, name: 'Wall-nut', cost: 3, attack: 3, defense: 6 }
            ],
        });
    },
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
