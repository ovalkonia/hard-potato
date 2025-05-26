import BaseSchemaException from "./BaseSchemaException.js";

export default class UserSchemaException extends BaseSchemaException {
    static errors = Object.freeze([
        "Invalid email",
        "Invalid username",
        "Invalid password",
    ]);

    static get INVALID_EMAIL() { return new this(0, 400); }
    static get INVALID_USERNAME() { return new this(1, 400); }
    static get INVALID_PASSWORD() { return new this(2, 400); }
}
