import { User } from "../models/User.js";

const auth_controller = {
    get_login: (req, res) => {
        return res.render("auth/login", {
            email: req.params.email,
        });
    },
    // I'll do proper error handling later

    post_login: async (req, res) => {
        try {
            const user = await new User({
                email: req.body.email,
                password: req.body.password,
            }).find();
            if (!user) {
                throw {
                    code: 401,
                };
            }

            // set session here

            res.json({
                status: "Success!",
                message: "Successfully logged in!",
                data: user,
            });
        } catch (error) {
            res.status(error.code).json({
                status: "Fail!",
                message: "Invalid creadentials typa stuff!",
            });
        }
    },

    get_register: (req, res) => {
        return res.render("auth/register", {
            email: req.params.email,
        });
    },
    post_register: async (req, res) => {
        try {
            const lookup = await new User({
                email: req.body.email,
            }).find();
            if (lookup) {
                throw {
                    code: 401,
                };
            }

            const user = await new User(req.body).insert([
                "email",
                "username",
                "password",
            ]);

            res.json({
                status: "Success!",
                message: "Successfully registered in!",
                data: user,
            });
        } catch (error) {
            res.status(error.code).json({
                status: "Fail!",
                message: "Some generaic error!",
            });
        }
    },
};

export default auth_controller;
