import UserSchema from "../schemas/UserSchema.js";
import UserModel from "../models/UserModel.js";
import MySQLModelAdapter from "../adapters/MySQLModelAdapter.js";
import mysql_pool from "../databases/mysql_pool.js";
import UserSchemaException from "../schemas/UserSchemaException.js";
import UserModelException from "../models/UserModelException.js";
import FilterBuilder from "../utils/FilterBuilder.js";

const auth_controller = {
    get_login: (req, res) => {
        return res.render("auth/login", {
            email: req.params.username,
        });
    },
    post_login: async (req, res) => {
        let connection = await mysql_pool.getConnection();;

        try {
            const user_schema = new UserSchema({
                username: req.body.email,
                password: req.body.password,
            });
            user_schema.validate_username();
            user_schema.validate_password();

            const model_adapter = new MySQLModelAdapter(connection, "users");

            const lookup = await new UserModel(user_schema, model_adapter).get_first();
            if (!lookup) throw UserModelException.INVALID_CREDENTIALS;

            res.json({
                status: "Success!",
                message: "Successfully logged in!",
                data: lookup,
            });
        } catch (error) {
            return res.status(error.code).json(error.form_response());
        } finally {
            if (connection) connection.release();
        }
    },

    get_register: (req, res) => {
        return res.render("auth/register", {
            email: req.params.username,
        });
    },
    post_register: async (req, res) => {
        let connection = await mysql_pool.getConnection();;

        try {
            const user_schema = new UserSchema({
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
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

            const user = await new UserModel(user_schema, model_adapter).save();

            res.json({
                status: "Success!",
                message: "Successfully registered!",
                data: user,
            });
        } catch (error) {
            return res.status(error.code).json(error.form_response());
        } finally {
            if (connection) connection.release();
        }
    },
};

export default auth_controller;
