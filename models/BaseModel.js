import FilterBuilder from "../utils/FilterBuilder.js";

export default class BaseModel {
    constructor(schema, adapter) {
        this.schema = schema;
        this.adapter = adapter;
    }

    static save(adapter, schema) { return adapter.save(schema.toJSON()); }
    static get_all_filter(adapter, filter) { return adapter.get_all_filter(filter); }
    static get_first_filter(adapter, filter) { return adapter.get_first_filter(filter); }
    static update_all_filter(adapter, changes, filter) { return adapter.update_all_filter(changes, filter); }
    static update_first_filter(adapter, changes, filter) { return adapter.update_first_filter(changes, filter); }
    static delete_all_filter(adapter, filter) { return adapter.delete_all_filter(filter); }
    static delete_first_filter(adapter, filter) { return adapter.delete_first_filter(filter); }

    strict_filter() {
        return FilterBuilder.and(
            ...Object.entries(this.schema.toJSON())
                .filter(([_, value]) => value !== undefined)
                .map(([key, value]) => FilterBuilder.where(key, "=", value))
        );
    }

    save() { return this.constructor.save(this.adapter, this.schema); }
    get_all() { return this.constructor.get_all_filter(this.adapter, this.strict_filter()); }
    get_first() { return this.constructor.get_first_filter(this.adapter, this.strict_filter()); }
    update_all(changes) { return this.constructor.update_all_filter(this.adapter, changes, this.strict_filter()); }
    update_first(changes) { return this.constructor.update_first_filter(this.adapter, changes, this.strict_filter()); }
    delete_all() { return this.constructor.delete_all_filter(this.adapter, this.strict_filter()); }
    delete_first() { return this.constructor.delete_first_filter(this.adapter, this.strict_filter()); }
}
