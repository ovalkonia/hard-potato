import { User, UserException } from "../models/User.js";

const profile_controller = {
    get_home: (req, res) => {
        // Тимчасово фейкові дані, треба буде витягувати з сесії або БД
        return res.render("profile/playerhome", {
            username: "PlayerName",
            avatarUrl: "/images/avatars/greenshadow.png",
        });
    },
    update_avatar: async (req, res) => {
        try {
            const user = req.session.user;
            if (!user) throw ModelException.UNAUTHORIZED;

            const { avatar } = req.body;
            if (!avatar) throw ModelException.INCOMPLETE_DATA;

            const updated = new User({ id: user.id, avatar });
            await updated.update(["avatar"]);

            res.json({
                status: "Success!",
                message: "Avatar updated!",
            });
        } catch (error) {
            res.status(error.code).json(error.form_response());
        }
    },
    update_password: async (req, res) => {
        try {
            const user = req.session.user;
            if (!user) throw ModelException.UNAUTHORIZED;

            const { password } = req.body;
            const updated = new User({ id: user.id, password })
                .validate_password();

            await updated.update(["password"]);

            res.json({
                status: "Success!",
                message: "Password updated!",
            });
        } catch (error) {
            res.status(error.code).json(error.form_response());
        }
    },
    update_username: async (req, res) => {
        try {
            const user = req.session.user;
            if (!user) throw ModelException.UNAUTHORIZED;

            const { username } = req.body;
            const updated = new User({ id: user.id, username })
                .validate_username();

            await updated.update(["username"]);

            res.json({
                status: "Success!",
                message: "Username updated!",
            });
        } catch (error) {
            res.status(error.code).json(error.form_response());
        }
    },
    post_logout: async (req, res) => {
        try {
            req.session.destroy(err => {
                if (err) {
                    const error = ModelException.SERVER_ERROR;
                    return res.status(error.code).json(error.form_response());
                }

                res.clearCookie("connect.sid");
                res.json({
                    status: "Success!",
                    message: "Logged out!",
                });
            });
        } catch (error) {
            res.status(error.code).json(error.form_response());
        }
    },
};

export default profile_controller;