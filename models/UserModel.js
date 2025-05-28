import bcrypt from "bcrypt";

import BaseModel from "./BaseModel.js";

export default class UserModel extends BaseModel {
    constructor(schema, adapter) {
        super(schema, adapter);
    }

    async hash_password(rounds) {
        this.schema.password = await bcrypt.hash(this.schema.password, rounds);
    }

    async compare_password(password) {
        return await bcrypt.compare(password, this.schema.password);
    }
}
