const db = require('../db/data-seed-test2');

const { get, getAll } = require('./detailsHelper');


async function getOrderDetails(req, res) {
     try {
        const id = req.params.id;

        const order = await get(
            `
            SELECT
                o.id AS orderId,
                o.status,
                o.created_at AS createdAt,

                u.id AS userId,
                u.first_name,
                u.last_name
            FROM orders o
            JOIN users u ON u.id = o.user_id
            WHERE o.id = ?
            `,
            [id]
        );

        if (!order) {
            return res.status(404).json({
                error: 'Order not found'
            });
        }

        const items = await getAll(
            `
            SELECT
                oi.product_id AS productId,
                p.name AS productName,
                oi.quantity,
                oi.unit_price AS unitPrice,
                (oi.quantity * oi.unit_price) AS subtotal
            FROM order_items oi
            JOIN products p ON p.id = oi.product_id
            WHERE oi.order_id = ?
            `,
            [id]
        );

        //doing grouping
        const grouped = {};
        //let itemsCount = 0;
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

            //itemsCount += item.quantity;
        }

        const resultItems = Object.values(grouped);

        const itemsCount = resultItems.reduce(
            (sum, item) => sum + item.quantity, 0
        );
        const totalAmount = resultItems.reduce(
            (sum, item) => sum + item.subtotal, 0
        );

        res.json({
            id: order.orderId,
            status: order.status,
            createdAt: order.createdAt,

            user: {
                id: order.userId,
                firstName: order.first_name,
                lastName: order.last_name
            },

            //items
            resultItems,

            itemsCount: itemsCount,
            totalAmount: totalAmount
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
}

module.exports = {
    getOrderDetails
};
