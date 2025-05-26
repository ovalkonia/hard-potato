export default class CardModelException extends Error {
    static errors = Object.freeze([

    ]);

    constructor(value, code) {
        super(CardModelException.errors[value]);

        this.code = code;
    }
}
