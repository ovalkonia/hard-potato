import { User, UserException } from "../models/User.js";

const auth_controller = {
    get_login: (req, res) => {
        return res.render("auth/login", {
            email: req.params.email,
        });
    },
    post_login: async (req, res) => {
        try {
            const user = await new User({
                email: req.body.email,
                password: req.body.password,
            }).find();
            if (!user) throw UserException.CREDENTIALS_INVALID;

            // set session here

            res.json({
                status: "Success!",
                message: "Successfully logged in!",
                data: user,
            });
        } catch (error) {
            res.status(error.code).json(error.form_response());
        }
    },

    get_register: (req, res) => {
        return res.render("auth/register", {
            email: req.params.email,
        });
    },
    post_register: async (req, res) => {
        try {
            const lookup = await new User({ email: req.body.email }).find();
            if (lookup) throw UserException.USER_EXISTS;

            const user = await new User({
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
            })
                .validate_email()
                .validate_username()
                .validate_password()
                .insert([
                    "email",
                    "username",
                    "password",
                ]);

            res.json({
                status: "Success!",
                message: "Successfully registered!",
                data: user,
            });
        } catch (error) {
            res.status(error.code).json(error.form_response());
        }
    },
};

export default auth_controller;
