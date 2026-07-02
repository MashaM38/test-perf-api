const db = require('../db/db-connection');

function getOrderItems() {

    const stmt = db.prepare(`
        SELECT *
            FROM order_items
    `);

    return stmt.all();
}


module.exports = {
    getOrderItems
};