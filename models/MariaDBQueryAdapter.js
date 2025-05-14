// Don't matter for now

export default class MariaDBQueryAdapter {
    static where(key, operator, value) {
        return {
            sql: `${key} ${operator} ?`,
            values: [value],
        };
    }

    static and(...filters) {
        return {
            sql: `(${filters.map(filter => filter.sql).join(" AND ")})`,
            values: filters.map(filter => filter.values).flat(),
        };
    }

    static or(...filters) {
        return {
            sql: `(${filters.map(filter => filter.sql).join(" OR ")})`,
            values: filters.map(filter => filter.values).flat(),
        };
    }
}
