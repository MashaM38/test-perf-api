// const sqlite3 = require("sqlite3").verbose();

// const db = new sqlite3.Database("./database_test.db");

// module.exports = db;

const Database = require('better-sqlite3');

const db = new Database('./database_test.db');
db.pragma('journal_mode = WAL');

console.log(
    db.prepare(`
        SELECT name
        FROM sqlite_master
        WHERE type='table'
    `).all()
);

module.exports = db;