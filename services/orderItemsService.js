const orderItemsRepository = require('../repositories/orderItemsRepository');

function getOrderItems() {
    return orderItemsRepository.getOrderItems();

}

module.exports = {
    getOrderItems
};