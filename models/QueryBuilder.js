export default class QueryBuilder {
    static where(key, operator, value) {
        return { type: "filter", key, operator, value };
    }

    static and(...filters) {
        return { type: "and", filters };
    }

    static or(...filters) {
        return { type: "or", filters };
    }

    static build(query, adapter) {
        switch (query.type) {
            case "filter": return adapter.where(query.key, query.operator, query.value);
            case "and": return adapter.and(...query.filters.map(filter => this.build(filter, adapter)));
            case "or": return adapter.or(...query.filters.map(filter => this.build(filter, adapter)));
        }
    }
}
