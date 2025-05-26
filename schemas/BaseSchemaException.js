export default class BaseSchemaException extends Error {
    static errors = Object.freeze([
        "Invalid format",
        "Value out of range",
    ]);

    static get INVALID_FORMAT() { return new this(0, 400); }
    static get OUT_OF_RANGE() { return new this(1, 400); }

    constructor(value, code) {
        super();

        this.value = value;
        this.code = code;
    }

    toString() {
        return this.constructor.errors[this.value];
    }

    form_response() {
        return {
            status: "Fail!",
            type: "Schema error",
            message: this.toString(),
            code: this.code,
        };
    }
}
