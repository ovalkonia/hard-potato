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
        const email_regexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email_regexp.test(this.email)) throw UserSchemaException.INVALID_EMAIL;

        return this;
    }

    validate_username() {
        const username_regexp = /^[a-zA-Z_]+$/;
        if (!username_regexp.test(this.username)) throw UserSchemaException.INVALID_USERNAME;

        return this;
    }

    validate_password() {
        const password_regexp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        if (!password_regexp.test(this.password)) throw UserSchemaException.INVALID_PASSWORD;

        return this;
    }

    validate_avatar_id() {
        return this;
    }
}
