import mysql_pool from "../databases/mysql_pool.js";
import FilterBuilder from "./FilterBuilder.js";
import MySQLFilterAdapter from "./MySQLFilterAdapter.js";

export class ModelException extends Error {
    static errors = Object.freeze([
        "Server error",
        "Unauthorized!",
        "Invalid data format!",
        "Incomplete data!",
    ]);

    static get SERVER_ERROR() { return new this(0, 500); }
    static get UNAUTHORIZED() { return new this(1, 401); }
    static get INVALID_FORMAT() { return new this(2, 400); }
    static get INCOMPLETE_DATA() { return new this(3, 400); }

    constructor(value, code) {
        super();

        this.value = value;
        this.code = code;
    }

    form_response() {
        return {
            status: "Fail!",
            message: this.toString(),
            code: this.code,
        };
    }

    toString() {
        return this.constructor.errors[this.value];
    }
}

export class Model {
    static init(table) {
        this.table = table;
    }

    get_strict_filter() {
        const filters = Object.entries(new this.constructor(this))
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => FilterBuilder.where(key, "=", value));

        return filters.length ? FilterBuilder.and(...filters) : FilterBuilder.where("1", "=", 1);
    }

    async insert(keys) {
        try {
            const columns = keys.join(", ");
            const values = keys.map(key => this[key]);
            const placeholders = keys.map(() => "?").join(", ");

            const statement = `INSERT INTO ${this.constructor.table} (${columns}) VALUES (${placeholders})`;

            const connection = await mysql_pool.getConnection();
            const prepare = await connection.prepare(statement);
            const result = await prepare.execute(values);

            return result;
        } catch (error) {
            throw ModelException.SERVER_ERROR;
        }
    }

    static async get_filter(filter = FilterBuilder.where("1", "=", 1)) {
        try {
            const { sql, values } = FilterBuilder.build(filter, MySQLFilterAdapter);

            const statement = `SELECT * FROM ${this.table} WHERE ${sql}`;

            const connection = await mysql_pool.getConnection();
            const prepare = await connection.prepare(statement);
            const [ results ] = await prepare.execute(values);

            return results;
        } catch (error) {
            throw ModelException.SERVER_ERROR;
        }
    }

    async get() {
        return this.constructor.get_filter(this.get_strict_filter());
    }

    static async find_filter(filter = FilterBuilder.where("1", "=", 1)) {
        const results = await this.get_filter(filter);

        return results.at(0) ?? null;
    }

    async find() {
        return this.constructor.find_filter(this.get_strict_filter());
    }
}
