import mariadb_pool from "../configs/mariadb_pool.js";
import QueryBuilder from "./QueryBuilder.js";
import MariaDBQueryAdapter from "../utils/MariaDBQueryAdapter.js";

// Don't matter for now

export class Model {
    static init(table) {
        this.table = table;
    }

    get_strict_query() {
        return QueryBuilder.and(
            ...Object.entries(new this.constructor(this))
                .filter(([_, value]) => value !== undefined)
                .map(([key, value]) => QueryBuilder.where(key, "=", value))
        );
    }

    async insert(keys) {
        try {
            const columns = keys.join(", ");
            const values = keys.map(key => this[key]);
            const placeholders = keys.map(() => "?").join(", ");

            const statement = `INSERT INTO ${this.constructor.table} (${columns}) VALUES (${placeholders})`;

            const connection = await mariadb_pool.getConnection();
            const prepare = await connection.prepare(statement);
            const result = await prepare.execute(values);

            console.log(result);
        } catch (error) {
            throw new Error("Database error");
        }
    }

    static async get_query(query = QueryBuilder.where("1", "=", 1)) {
        try {
            const { sql, values } = QueryBuilder.build(query, MariaDBQueryAdapter);

            const statement = `SELECT * FROM ${this.table} WHERE ${sql}`;

            const connection = await mariadb_pool.getConnection();
            const prepare = await connection.prepare(statement);
            const results = await prepare.execute(values);

            return results;
        } catch (error) {
            throw new Error("Database error");
        }
    }

    async get() {
        return this.constructor.get_query(this.get_strict_query());
    }

    static async find_query(query = QueryBuilder.where("1", "=", 1)) {
        const results = await this.get_query(query);

        return results.at(0) ?? null;
    }

    async find() {
        return this.constructor.find_query(this.get_strict_query());
    }
}
