const express = require ('express');

const router = express.Router();

const orderItemsController = require('../controllers/orderItemsController');

router.get('/', orderItemsController.getAllOrderItems);

module.exports = router;