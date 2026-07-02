const Database = require('better-sqlite3');

const db = new Database('./database_test.db');
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 3000');

module.exports = db;