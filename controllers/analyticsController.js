const db = require('../db/data-seed-test2');
const { getAll } = require('./detailsHelper');


async function getAnalyticsPopularProducts(req, res) {
    const rows = await getAll(
    `
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
    `
    );
    res.json(rows);
}


module.exports = {
    getAnalyticsPopularProducts
};
