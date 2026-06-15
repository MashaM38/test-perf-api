const db = require('../db/db-connection');

function getUserById(userId) {

    const stmt = db.prepare(`
        SELECT *
        FROM users
        WHERE id = ?
    `);

    return stmt.get(userId);
}

function getAllUsers() {
    
    const stmt = db.prepare(`
        SELECT *
        FROM users
    `);

    return stmt.all();
}

module.exports = {
    getUserById,
    getAllUsers
};