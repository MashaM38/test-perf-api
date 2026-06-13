const db = require('../db/data-seed-test2');

function getProductById(req, res) {
    const id = req.params.id;

    db.get(
        `
        SELECT *
        FROM products
        WHERE id = ?
        `,
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    error: 'Product not found'
                });
            }

            res.json(row);
        }
    );
}

function getAllProducts(req, res) {
    console.log(db);
    console.log(typeof db.all);
    console.log(typeof db.get);

    db.all(
        `
        SELECT *
        FROM products
        `,
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );
}


module.exports = {
    getProductById,
    getAllProducts
};
