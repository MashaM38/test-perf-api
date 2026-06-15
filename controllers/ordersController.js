//const db = require('../db/db-connection');

const { get, getAll, runQuery } = require('./detailsHelper');
const { faker } = require("@faker-js/faker");

const orderService = require('../services/orderService');

async function getOrders(req, res) {

    console.log('Controller start');

    const orders =
        orderService.getOrders();

    console.log('Service returned');

    res.json(orders);

}

async function getOrderById(req, res) {

    try {
        const order = orderService.getSingleOrderById(req.params.id);
        if (!order) {

            return res.status(404).json({
                error: 'Order not found'
            });

        }
        res.json(order);

    } catch(err) {
        res.status(500).json({
            error: err.message
        });
    }
}

async function deleteOrder(req, res) {
    try {
        const orderId = Number(req.params.id);
        const result = orderService.deleteOrder(orderId);

        res.json(result);
    } catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
}

async function createOrder(req, res) {

    try {

        const orderId =
            orderService.createOrder(
                req.body
            );

        res.status(201).json({
            orderId
        });

    } catch(err) {

        res.status(500).json({
            error: err.message
        });

    }

}

async function updateOrder(req, res) {

    try {

        const orderId =
            orderService.updateOrder(
                req.params.id,
                req.body
            );

        res.status(200).json({
            orderId
        });

    } catch(err) {

        res.status(500).json({
            error: err.message
        });

    }

}


module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
