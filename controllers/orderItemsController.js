const orderItemsService = require('../services/orderItemsService');

async function getAllOrderItems(req, res) {
    try {
            const order_items = orderItemsService.getOrderItems();
            res.json(order_items);
        } catch(err) {
            res.status(500).json({
                error: err.message
            })
        }
}

module.exports = {
    getAllOrderItems
};
