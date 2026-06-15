// const db = require('../db/db-connection');

// const { get, getAll, runQuery } = require('./detailsHelper');
// const { faker } = require("@faker-js/faker");

const orderService = require('../services/orderService');

async function getOrderDetails(req, res) {

    try {
        const order = orderService.getOrderDetails(req.params.id);
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

module.exports = {
    getOrderDetails
};
