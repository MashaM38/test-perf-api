const express = require ('express');

const router = express.Router();

const productsController = require('../controllers/productsController');
//const { getAllProducts } = require('../controllers/productsController');

//router.get('/:id', getProductById);
router.get('/', productsController.getAllProducts);

module.exports = router;
