const Database = require('better-sqlite3');

const db = new Database('./database_test.db');
db.pragma('journal_mode = WAL');

module.exports = db;