const db = require('../db/db-connection');

function getAnalyticsPopularProducts() {
    
    const stmt = db.prepare(`
        SELECT
            p.id,
            p.name,
            SUM(oi.quantity) AS total_sold
        FROM products p
        JOIN order_items oi
            ON oi.product_id = p.id
        GROUP BY p.id, p.name
        ORDER BY total_sold DESC
        LIMIT 20
    `);

    return stmt.all();
    console.log("query executed");
}

module.exports = {
    getAnalyticsPopularProducts
};