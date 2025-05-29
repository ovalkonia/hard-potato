import mysql_pool from "../databases/mysql_pool.js";
import UserSchema from "../schemas/UserSchema.js";
import UserModel from "../models/UserModel.js";
import UserModelException from "../models/UserModelException.js";
import MySQLModelAdapter from "../adapters/MySQLModelAdapter.js";
import FilterBuilder from "../utils/FilterBuilder.js";

const auth_controller = {
    get_login: (req, res) => {
        return res.render("auth/login", {
            username: req.params.username,
        });
    },
    post_login: async (req, res) => {
        let connection = await mysql_pool.getConnection();;

        try {
            const user_schema = new UserSchema({
                username: req.body.username,
                password: req.body.password,
            });
            user_schema.validate_username();
            user_schema.validate_password();

            const model_adapter = new MySQLModelAdapter(connection, "users");

            const lookup = await UserModel.get_first_filter(model_adapter, FilterBuilder.where("username", "=", user_schema.username));
            if (!lookup) throw UserModelException.INVALID_CREDENTIALS;

            const user_model = new UserModel(lookup, model_adapter);
            if (!await user_model.compare_password(user_schema.password)) throw UserModelException.INVALID_CREDENTIALS;

            req.session.user = lookup;
            res.json({
                status: "Success!",
                message: "Successfully logged in!",
            });
        } catch (error) {
            return res.status(error.code).json(error.form_response());
        } finally {
            if (connection) connection.release();
        }
    },

    get_register: (req, res) => {
        return res.render("auth/register");
    },
    post_register: async (req, res) => {
        let connection = await mysql_pool.getConnection();

        try {
            const user_schema = new UserSchema({
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                avatar_id: 2,
            });
            user_schema.validate_email();
            user_schema.validate_username();
            user_schema.validate_password();

            const model_adapter = new MySQLModelAdapter(connection, "users");

            const lookup = await UserModel.get_first_filter(
                model_adapter,
                FilterBuilder.or(
                    FilterBuilder.where("email", "=", user_schema.email),
                    FilterBuilder.where("username", "=", user_schema.username)
                )
            );
            if (lookup) {
                if (lookup.email === user_schema.email) throw UserModelException.DUPLICATE_EMAIL;
                if (lookup.username === user_schema.username) throw UserModelException.DUPLICATE_USERNAME;
            }

            const user = new UserModel(user_schema, model_adapter);
            await user.hash_password(10);
            await user.save();

            res.json({
                status: "Success!",
                message: "Successfully registered!",
            });
        } catch (error) {
            return res.status(error.code).json(error.form_response());
        } finally {
            if (connection) connection.release();
        }
    },

    post_logout: async (req, res) => {
        await req.session.destroy();
        res.redirect("/auth/login");
    },
};

export default auth_controller;
