const express = require ('express');

const router = express.Router();

const { getOrderById, getOrderById_test } = require('../controllers/ordersController');
const { getAllOrders } = require('../controllers/ordersController');
const { getOrderDetails } = require('../controllers/orderDetailsController');
const ordersController = require('../controllers/ordersController');

//router.get('/:id', getOrderById);
router.get('/:id', getOrderById_test);
router.get('/', getAllOrders);
router.get('/:id/details', getOrderDetails);

router.post('/', ordersController.createOrder);

router.put('/:id', ordersController.updateOrder_test);

router.delete('/:id', ordersController.deleteOrder);

module.exports = router;
