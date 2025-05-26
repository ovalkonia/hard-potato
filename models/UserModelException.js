import BaseModelException from "./BaseModelException.js";

export default class UserModelException extends BaseModelException {
    static errors = Object.freeze([
        "User not found",
        "Email already exists",
        "Username is taken",
        "Invalid credentials",
    ]);

    static get NOT_FOUND() { return new this(0, 404); }
    static get DUPLICATE_EMAIL() { return new this(1, 409); }
    static get DUPLICATE_USERNAME() { return new this(2, 409); }
    static get INVALID_CREDENTIALS() { return new this(3, 401); }

    form_response() {
        return {
            status: "Fail!",
            type: "User error",
            message: this.toString(),
            code: this.code,
        };
    }
}
