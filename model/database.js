"use strict";

const mysql = require("mysql");
const config = require("../config.json");

const pool = mysql.createPool(config.db);

const getConnection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) {
                reject(err);
            } else {
                resolve(con);
            }
        });
    });
};

const query = (con, sql) => {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

const execute = async (sql) => {
    let con;

    try {
        con = await getConnection();
        const results = await query(con, sql);
        con.release();
        return results;
    } catch (err) {
        if (con) {
            con.release();
        }
        throw err;
    }
};
module.exports = {
    execute
};