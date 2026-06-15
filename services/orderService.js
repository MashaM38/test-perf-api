//const db = require('../db/db-connection');

const orderRepository = require('../repositories/orderRepository');

function getOrders() {
    return orderRepository.getOrders();

}

function createOrder(data) {
    return orderRepository.createOrder(data);
}

function getOrderDetails(id) {
    const order = orderRepository.getOrderById(id);

    if (!order) {
        return null;
    }

    const items = orderRepository.getOrderItems(id);

    const grouped = {};

    for (const item of items) {

        if (!grouped[item.productId]) {

            grouped[item.productId] = {
                productId: item.productId,
                productName: item.productName,
                quantity: 0,
                unitPrice: item.unitPrice,
                subtotal: 0
            };

        }

        grouped[item.productId].quantity += item.quantity;
        grouped[item.productId].subtotal += item.subtotal;
    }

    const resultItems =
        Object.values(grouped);

    const itemsCount =
        resultItems.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

    const totalAmount = resultItems.reduce(
            (sum, item) => sum + item.subtotal, 0
        );    

    return {
        id: order.orderId,
        status: order.status,
        createdAt: order.createdAt,

        user: {
            id: order.userId,
            firstName: order.first_name,
            lastName: order.last_name
        },

        items: resultItems,
        itemsCount,
        totalAmount: totalAmount,
    };
}

function getSingleOrderById(id) {
    const order = orderRepository.getOrderById(id);
    console.log("order = " + order);

    if (!order) {
        return null;
    }

    const items = orderRepository.getOrderItems(id);
    console.log("order items = " + items);

    const grouped = {};
    //let totalAmount = 0;

    for (const item of items) {

        if (!grouped[item.productId]) {

            grouped[item.productId] = {
                productId: item.productId,
                productName: item.productName,
                quantity: 0,
                unitPrice: item.unitPrice
            };

        }

        grouped[item.productId].quantity += item.quantity;
        
        //const unitPrice = item.unitPrice;
        //totalAmount += unitPrice * item.quantity;
    }

    const resultItems =
        Object.values(grouped);

    const itemsCount =
        resultItems.reduce(
            (sum, item) => sum + item.quantity,
            0
        );  

    const totalAmount = items.reduce(
        (sum, item) => sum + item.subtotal,
        0
    );

    // update totalAmount in db
    //orderRepository.updateOrderTotal(totalAmount, id); 

    console.log(order);
    
    return {
        id: order.orderId,
        status: order.status,
        createdAt: order.createdAt,
        totalAmount: totalAmount, //totalAmount, //order.totalAmount,

        user: {
            id: order.userId,
            firstName: order.first_name,
            lastName: order.last_name
        },

        itemsCount
    };
}

function updateOrder(orderId, data) {
    return orderRepository.updateOrder(orderId, data);
}

function deleteOrder(orderId) {
    return orderRepository.deleteOrder(orderId);
}

module.exports = {
    getOrders,
    createOrder,
    getSingleOrderById,
    getOrderDetails,
    //createNewOrder,
    updateOrder,
    deleteOrder
};