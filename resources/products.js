const express = require ('express');

const router = express.Router();

const { getProductById } = require('../controllers/productsController');
const { getAllProducts } = require('../controllers/productsController');

router.get('/:id', getProductById);
router.get('/', getAllProducts);

module.exports = router;
