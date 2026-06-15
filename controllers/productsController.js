const productService = require('../services/productService');

async function getAllProducts(req, res) {
    try {
            const products = productService.getAllProducts();
            res.json(products);
        } catch(err) {
            res.status(500).json({
                error: err.message
            })
        }
}


module.exports = {
    getAllProducts
};
