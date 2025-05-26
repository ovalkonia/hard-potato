import BaseSchema from "./BaseSchema.js";
import UserSchemaException from "./UserSchemaException.js";

export default class UserSchema extends BaseSchema {
    constructor({ id, email, username, password, avatar_id }) {
        super();

        this.id = this.constructor.to_number(id);
        this.email = this.constructor.to_string(email);
        this.username = this.constructor.to_string(username);
        this.password = this.constructor.to_string(password);
        this.avatar_id = this.constructor.to_number(avatar_id);
    }

    validate_email() {
        // Actually validate this stuff and do
        // throw UserSchemaException.INVALID_EMAIL;
        // if needed

        return this;
    }

    validate_username() {
        // Actually validate this stuff and do
        // throw UserSchemaException.INVALID_USERNAME;
        // if needed

        return this;
    }

    validate_password() {
        // Actually validate this stuff and do
        // throw UserSchemaException.INVALID_PASSWORD;
        // if needed

        return this;
    }
}
