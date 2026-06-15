const productRepository = require('../repositories/productRepository');

function getAllProducts() {
    return productRepository.getAllProducts();
}

module.exports = {
    getAllProducts
}