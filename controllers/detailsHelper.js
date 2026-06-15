//const db = require('../db/data-seed-test2');

//const sqlite3 = require("sqlite3").verbose();
//const db = new sqlite3.Database("./database_test.db");

const db = require('../db/db-connection');


function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function getAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

async function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {

        db.run(sql, params, function(err) {

            if (err) {
                reject(err);
                return;
            }

            resolve({
                lastID: this.lastID,
                changes: this.changes
            });

        });

    });
}

module.exports = {
    get, getAll, runQuery
};
