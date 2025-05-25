import FilterBuilder from "../utils/FilterBuilder.js";
import MySQLFilterAdapter from "./MySQLFilterAdapter.js";

export default class MySQLModelAdapter {
    constructor(connection, table) {
        this.connection = connection;
        this.table = table;
    }

    async save(schema) {
        const columns = Object.keys(schema);
        const values = Object.values(schema);
        const placeholders = values.map(() => "?").join(", ");

        const statement = `INSERT INTO ${this.table} (${columns}) VALUES (${placeholders})`;
        const [ result ] = await this.connection.execute(statement, values);

        return result;
    }

    async get_all_filter(filter = FilterBuilder.where("1", "=", 1)) {
        const where = FilterBuilder.build(filter, MySQLFilterAdapter);
        const statement = `SELECT * FROM ${this.table} WHERE (${where.sql})`;
        const [ results ] = await this.connection.execute(statement, where.values);

        return results;
    }

    async get_first_filter(filter = FilterBuilder.where("1", "=", 1)) {
        const where = FilterBuilder.build(filter, MySQLFilterAdapter);
        const statement = `SELECT * FROM ${this.table} WHERE (${where.sql}) LIMIT 1`;
        const [[ result ]] = await this.connection.execute(statement, where.values);

        return result ?? null;
    }

    async update_all_filter(changes, filter) {
        const set = {
            sql: Object.keys(changes).map(key => `${key} = ?`).join(", "),
            values: Object.values(changes),
        };
        const where = FilterBuilder.build(filter, MySQLFilterAdapter);
        const statement = `UPDATE ${this.table} SET ${set.sql} WHERE (${where.sql})`;
        const result = await this.connection.execute(statement, [...set.values, ...where.values]);

        console.log("LOGGING");
        console.log("MySQLModelAdapter");
        console.log("UPDATE_ALL_FILTER method");
        console.log(result);

        return result;
    }

    async update_first_filter(changes, filter) {
        const set = {
            sql: Object.keys(changes).map(key => `${key} = ?`).join(", "),
            values: Object.values(changes),
        };
        const where = FilterBuilder.build(filter, MySQLFilterAdapter);
        const statement = `UPDATE ${this.table} SET ${set.sql} WHERE (${where.sql}) LIMIT 1`;
        const result = await this.connection.execute(statement, [...set.values, ...where.values]);

        console.log("LOGGING");
        console.log("MySQLModelAdapter");
        console.log("UPDATE_ALL_FILTER method");
        console.log(result);

        return result;
    }

    async delete_all_filter(filter) {
        const where = FilterBuilder.build(filter, MySQLFilterAdapter);
        const statement = `DELETE FROM ${this.table} WHERE (${where.sql})`;
        const result = await this.connection.execute(statement, where.values);

        console.log("LOGGING");
        console.log("MySQLModelAdapter");
        console.log("DELETE_ALL_FILTER method");
        console.log(result);

        return result;
    }

    async delete_first_filter(filter) {
        const where = FilterBuilder.build(filter, MySQLFilterAdapter);
        const statement = `DELETE FROM ${this.table} WHERE (${where.sql}) LIMIT 1`;
        const result = await this.connection.execute(statement, where.values);

        console.log("LOGGING");
        console.log("MySQLModelAdapter");
        console.log("DELETE_FIRST_FILTER method");
        console.log(result);

        return result;
    }
}
