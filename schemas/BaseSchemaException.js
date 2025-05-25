export default class BaseSchemaException extends Error {
    static errors = Object.freeze([
        "Invalid format",
        "Value out of range",
    ]);

    static get INVALID_FORMAT() { return new this(0, 400); }
    static get OUT_OF_RANGE() { return new this(1, 400); }

    constructor(value, code) {
        super(BaseSchemaException.errors[value]);

        this.code = code;
    }

    form_response() {
        return {
            status: "Fail!",
            type: "Schema error",
            message: this.message,
            code: this.code,
        };
    }
}
