import { Model } from "./Model.js";

export class User extends Model {
    static {
        super.init("users");
    }

    constructor({ id, email, password }) {
        super();

        this.id = id;
        this.email = email;
        this.password = password;
    }
}
