import { Model, ModelException } from "./Model.js";

export class UserException extends ModelException {
    static errors = Object.freeze([
        "Email is invalid!",
        "Userame is invalid!",
        "Password is invalid!",
        "User already exists!",
        "Invalid credentials!",
    ]);

    static get EMAIL_INVALID() { return new this(0, 400); }
    static get USERNAME_INVALID() { return new this(1, 400); }
    static get PASSWORD_INVALID() { return new this(2, 400); }
    static get USER_EXISTS() { return new this(3, 409); }
    static get CREDENTIALS_INVALID() { return new this(4, 401); }
}

export class User extends Model {
    static {
        super.init("users");
    }

    constructor({ id, email, username, password }) {
        super();

        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
    }

    validate_email() {
        // throw UserException.EMAIL_INVALID is something's wrong

        return this;
    }

    validate_username() {
        // throw UserException.USERNAME_INVALID is something's wrong

        return this;
    }

    validate_password() {
        // throw UserException.PASSWORD_INVALID is something's wrong

        return this;
    }
}
