const db = require('../db/db-connection');

function getAllProducts() {
    
    const stmt = db.prepare(`
        SELECT *
        FROM products
    `);

    return stmt.all();
}

module.exports = {
    getAllProducts
};