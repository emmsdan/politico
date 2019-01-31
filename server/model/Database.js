import dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();
/* eslint-disable no-restricted-syntax */
/**
 * @author Emmanuel Daniel <@emmsdan>
 * @description handles all database interactions
 */
export default class Database {
  /**
   * @description initiate  database connection
   * @return  promise
   */
  static connect() {
    return new Pool({
      connectionString: process.env.PG_HOST_URL
    });
  }


  /**
   *
   * @param {object/null} statement
   */
  static isNotObject(statement) {
    if (!statement || typeof statement !== 'object' || Array.isArray(statement)) {
      throw Error('specify an object or leave black');
    }
  }

  /**
   *
   * @param {object/null} statement
   * @param {string} seperator
   * @returns object
   */
  static arrangeColumns(statement, seperator) {
    let columns = '';
    let count = 0;
    if (!Array.isArray(statement)) {
      // eslint-disable-next-line guard-for-in
      for (const column in statement) {
        columns += ` ${column}='${statement[column]}' `;
        if (count < (Object.keys(statement).length - 1)) {
          columns += `${seperator}`;
        }
        count += 1;
      }
    }
    return columns;
  }

  /**
   * @description create tabse in the database.
   * @param {string} table
   * @param {object} columns
   */
  static async create(table, columns) {
    // check for empty fields
    if (!columns || !Array.isArray(columns)) throw Error('columns must be specified and should be an Array of Objects [{}]');
    let fields = '';
    for (const field of columns) {
      fields += `${field.name} ${Database.columnType(field.type, field.key || 'none')}, `;
    }

    const sql = `CREATE TABLE IF NOT EXISTS ${table.toLowerCase()} (id SERIAL, ${fields} createdOn timestamp not null default CURRENT_TIMESTAMP, updatedOn timestamp not null default CURRENT_TIMESTAMP );`;
    const db = Database.connect();
    const res = await db.query(sql);
    await db.end();
    return res;
  }

  /**
   * @description deletes table from database
   * @param {string} tablename
   */
  static async deleteTable(tablename) {
    if (!tablename) return;
    const db = Database.connect();
    const res = await db.query(`DROP TABLE IF EXISTS ${tablename}`);
    await db.end();
    return res;
  }

  /**
   * @description inserts data into database
   * @param {string} tablename
   * @param {object} fields
   */
  static async insert(tablename, fields) {
    // check for empty fields
    if (!fields) return;
    const values = Object.values(fields);
    const theFields = Object.keys(fields);
    let value = ''; let field = '';
    theFields.forEach((item, index) => {
      field += `${item}`;
      if (index < (theFields.length - 1)) field += ', ';
    });
    values.forEach((item, index) => {
      value += `'${item}'`;
      if (index < (values.length - 1)) value += ', ';
    });
    // build sql query
    const sql = `INSERT INTO ${tablename.toLowerCase()} (${field}) VALUES (${value})`;
    const db = Database.connect();
    const res = await db.query(sql);
    await db.end();
    return res;
  }

  /**
   * @description select data from table
   * @param {string} tablename
   * @param {array/null} statement
   */
  static async select(tablename, statement = null) {
    if (statement && !Array.isArray(statement)) throw Error('specify array or leave black');

    let columns = '';
    if (Array.isArray(statement)) {
      let count = 0;
      for (const column of statement) {
        columns += column;
        if (count < (statement.length - 1)) columns += ', ';
        count += 1;
      }
    } else {
      columns = '*';
    }
    // build sql query
    const sql = `SELECT ${columns} FROM ${tablename.toLowerCase()}`;
    const db = Database.connect();
    const res = await db.query(sql);
    await db.end();
    if (res.rowCount < 1) return 'no record found';
    return res.rows;
  }

  /**
   * @description find columns that match
   * @param {string} tablename
   * @param {object} statement
   * @param {string} seperator
   */
  static async find(tablename, statement = null, seperator = ' AND ') {
    const columns = Database.arrangeColumns(statement, seperator);
    // build sql query
    const sql = `SELECT * FROM ${tablename.toLowerCase()} WHERE ${columns}`;
    const db = Database.connect();
    const res = await db.query(sql);
    await db.end();
    if (res.rowCount < 1) return 'not found';
    return res.rows;
  }

  /**
   * @description delete selected column from table
   * @param {string} tablename
   * @param {object/null} statement
   * @param {string} seperator
   */
  static async deleteRow(tablename, statement = null, seperator = ' AND ') {
    const columns = Database.arrangeColumns(statement, seperator);
    // build sql query
    const sql = `DELETE FROM ${tablename.toLowerCase()} WHERE ${columns}`;
    const db = Database.connect();
    const res = await db.query(sql);
    await db.end();
    if (res.rowCount < 1) return 'not found';
    return 'deleted';
  }

  /**
   *
   * @param {string} tablename
   * @param {object/null} setState
   * @param {object/null} whereState
   * @param {string} seperator
   */
  static async update(tablename, setState = null, whereState = null, seperator = ' AND ') {
    Database.isNotObject(setState);
    Database.isNotObject(whereState);
    const setColumns = Database.arrangeColumns(setState, ',');
    const whereColumns = Database.arrangeColumns(whereState, seperator);
    // build sql query
    const sql = `UPDATE ${tablename.toLowerCase()} SET ${setColumns}  WHERE ${whereColumns}`;

    const db = Database.connect();
    const res = await db.query(sql);
    await db.end();
    if (res.rowCount < 1) return 'not found';
    return 'deleted';
  }

  /**
   * @description access database directly
   * @param {sqlString} sql
   * @returns promise
   */
  static async rawSql(sql) {
    const db = Database.connect();
    const res = await db.query(sql);
    await db.end();
    return res;
  }

  /**
   * @description spec types
   * @param {string} type
   * @param {string} key
   * @returns Array
   */
  static columnType(type = 'string', key = 'none') {
    const columnsType = {
      string: 'VARCHAR', text: 'TEXT', boolean: 'BOOLEAN', condition: 'BOOL DEFAULT \'f\'', int: 'INT', number: 'Numeric', autoincrement: 'SERIAL', data: 'DATE', time: 'TIME', timestamp: 'TIMESTAMP', array: 'TEXT []'
    };
    const columnKey = { none: '', unique: 'UNIQUE', primary: 'PRIMARY KEY' };
    return `${columnsType[type.toLowerCase()]} ${columnKey[key.toLowerCase()] || columnKey.none}`;
  }
}
