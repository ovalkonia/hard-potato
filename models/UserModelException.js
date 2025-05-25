export default class UserModelException extends Error {
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

    constructor(value, code) {
        super(UserModelException.errors[value]);

        this.code = code;
    }

    form_response() {
        return {
            status: "Fail!",
            type: "User error",
            message: this.message,
            code: this.code,
        };
    }
}
