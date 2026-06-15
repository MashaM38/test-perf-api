const express = require ('express');

const router = express.Router();

const ordersController = require('../controllers/ordersController');
const orderDetailsController = require('../controllers/orderDetailsController');

router.get('/:id', ordersController.getOrderById);
router.get('/', ordersController.getOrders);
router.get('/:id/details', orderDetailsController.getOrderDetails);

router.post('/', ordersController.createOrder);

router.put('/:id', ordersController.updateOrder);

router.delete('/:id', ordersController.deleteOrder);

module.exports = router;
