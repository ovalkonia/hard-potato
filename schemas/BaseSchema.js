import BaseSchemaException from "./BaseSchemaException.js";

export default class BaseSchema {
    static to_string(value) {
        if (value === undefined) {
            return undefined;
        }

        return String(value).trim();
    }

    static to_number(value) {
        if (value === undefined) {
            return undefined;
        }

        const number = Number(value);
        if (isNaN(number)) {
            throw BaseSchemaException.INVALID_FORMAT;
        }

        return number;
    }

    static to_boolean(value) {
        if (value === undefined) {
            return undefined;
        }

        if (value === "true" ||
            value === "on" ||
            value === true ||
            value === 1) {
            return true;
        }

        if (value === "false" ||
            value === "off" ||
            value === false ||
            value === 0) {
            return false;
        }

        throw BaseSchemaException.INVALID_FORMAT;
    }

    toJSON() {
        return Object.fromEntries(
            Object.entries(new this.constructor(this))
                .filter(([_, value]) => value !== undefined)
        );
    }
}
