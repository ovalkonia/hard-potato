import bcrypt from "bcrypt";
import mysql_pool from "../databases/mysql_pool.js";
import UserSchema from "../schemas/UserSchema.js";
import UserModel from "../models/UserModel.js";
import MySQLModelAdapter from "../adapters/MySQLModelAdapter.js";
import FilterBuilder from "../utils/FilterBuilder.js";
import UserModelException from "../models/UserModelException.js";

const profile_controller = {
    get_self: (req, res) => {
        return res.render("profile/self", {
            username: req.session.user.username,
            avatar_id: req.session.user.avatar_id,
        });
    },
    post_self: async (req, res) => {
        let connection = await mysql_pool.getConnection();;

        try {
            if (req.body.new_password &&
                !await bcrypt.compare(req.body.password, req.session.user.password)) {
                throw UserModelException.UNAUTHORIZED;
            }

            if (req.body.username &&
                !await bcrypt.compare(req.body.password, req.session.user.password)) {
                throw UserModelException.UNAUTHORIZED;
            }

            const model_adapter = new MySQLModelAdapter(connection, "users");
            const user_schema = new UserSchema({
                username: req.body.username,
                password: req.body.new_password,
                avatar_id: req.body.avatar_id,
            });

            const user_model = new UserModel(user_schema, model_adapter);

            if (user_model.schema.username) {
                user_model.schema.validate_username();
                const lookup = await UserModel.get_first_filter(
                    model_adapter,
                    FilterBuilder.where("username", "=", user_model.schema.username)
                );
                if (lookup) throw UserModelException.DUPLICATE_USERNAME;
            }

            if (user_model.schema.password) {
                user_model.schema.validate_password();
                await user_model.hash_password(12);
            }

            if (user_model.schema.avatar_id) {
                user_model.schema.validate_avatar_id();
            }

            await UserModel.update_first_filter(
                model_adapter,
                user_schema.toJSON(),
                FilterBuilder.where("id", "=", req.session.user.id)
            );

            Object.assign(req.session.user, user_schema.toJSON());
            res.json({
                status: "Success!",
                message: "Successfully updated profile!",
            });
        } catch (error) {
            return res.status(error.code).json(error.form_response());
        } finally {
            if (connection) connection.release();
        }
    },

    get_profile: (req, res) => {
        return res.render("profile/profile");
    },
};

export default profile_controller;