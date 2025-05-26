export default class BaseModelException extends Error {
    static errors = Object.freeze([
        "Server error",
        "Not found",
        "Duplicate entry",
        "Unauthorized",
        "Database timeout",
    ]);

    static get SERVER_ERROR() { return new this(0, 500); }
    static get NOT_FOUND() { return new this(1, 404); }
    static get DUPLICATE() { return new this(2, 409); }
    static get UNAUTHORIZED() { return new this(3, 401); }
    static get TIMEOUT() { return new this(4, 503); }

    constructor(value, code) {
        super(BaseModelException.errors[value]);

        this.code = code;
    }

    form_response() {
        return {
            status: "Fail!",
            type: "Model error",
            message: this.message,
            code: this.code,
        };
    }
}
