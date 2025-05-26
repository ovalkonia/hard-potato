import BaseSchema from "./BaseSchema.js";
import CardSchemaException from "./UserSchemaException.js";

export default class CardSchema extends BaseSchema {
    constructor({ id, name, cost, attack, defense }) {
        super();

        this.id = this.constructor.to_number(id);
        this.name = this.constructor.to_string(name);
        this.cost = this.constructor.to_number(cost);
        this.attack = this.constructor.to_number(attack);
        this.defense = this.constructor.to_number(defense);
    }
}
