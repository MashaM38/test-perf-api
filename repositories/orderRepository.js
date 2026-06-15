const db = require('../db/db-connection');

const { get, getAll, runQuery } = require('../controllers/detailsHelper');
const { faker } = require('@faker-js/faker');

function getOrders() {

    console.log('Repository start');

    const rows =
        db.prepare(`
            SELECT *
            FROM orders
        `).all();

    console.log('Repository end');

    return rows;

}

function insertOrder(userId, status, createdAt) {

    const stmt = db.prepare(`
        INSERT INTO orders
        (user_id, status, created_at)
        VALUES (?, ?, ?)
    `);

    const result = stmt.run(
        userId,
        status,
        createdAt
    );

    return result.lastInsertRowid;
}

function getProductPrice(productId) {

    const stmt = db.prepare(`
        SELECT price
        FROM products
        WHERE id = ?
    `);

    return stmt.get(productId);
}

function insertOrderItem(orderId, productId, quantity, unitPrice) {

    const stmt = db.prepare(`
        INSERT INTO order_items
        (order_id, 
        product_id,
        quantity, 
        unit_price)
        VALUES (?, ?, ?, ?)
    `);

    return stmt.run(
        orderId,
        productId,
        quantity,
        unitPrice
    );
}

const createOrderTransaction = db.transaction((data) => {

        const { userId, status, items} = data;

        const orderId = insertOrder(userId, status, new Date().toISOString());

        let totalAmount = 0;

        for (const item of items) {

            const product =
                getProductPrice(
                    item.productId
                );

            const unitPrice =
                product.price;

            totalAmount +=
                unitPrice *
                item.quantity;

            insertOrderItem(
                orderId,
                item.productId,
                item.quantity,
                unitPrice
            );

        }

    // db.prepare(`
    //     UPDATE orders
    //     SET total_amount = ?
    //     WHERE id = ?
    // `).run(
    //     totalAmount,
    //     orderId
    // );

    updateOrderTotal(totalAmount, orderId);

    return orderId;
});


function createOrder(data) {
    return createOrderTransaction(data);
}

function updateOrderStatus(status, id) {
    const stmt = db.prepare(`
        UPDATE orders
        SET status = ?
        WHERE id = ?
    `);

    return stmt.run(status, id);
}

function deleteOrderItemsWithOrderId(id) {
    const stmt = db.prepare(`
        DELETE FROM order_items
        WHERE order_id = ?
    `);

    return stmt.run(id);
}

function deleteSingleOrder(id) {
    const stmt = db.prepare(
        `
        DELETE FROM orders
        WHERE id = ?        `
    );

    return stmt.run(id);
}

function updateOrderTotal(totalAmount, orderId) {
    const stmt = db.prepare(`
        UPDATE orders
        SET total_amount = ?
        WHERE id = ?
        `);
    return stmt.run(totalAmount, orderId);    

}

const updateOrderTransaction = db.transaction((orderId, data) => {

    const { status, items } = data;

    const order = updateOrderStatus(status, orderId);    
    
    deleteOrderItemsWithOrderId(orderId);

    let totalAmount = 0;

    for (const item of items) {

        const product =
            getProductPrice(
                item.productId
            );

        const unitPrice =
            product.price;

        totalAmount +=
            unitPrice *
            item.quantity;

        insertOrderItem(
            orderId,
            item.productId,
            item.quantity,
            unitPrice
        );

    }

    updateOrderTotal(totalAmount, orderId);

    return order;
});


function updateOrder(orderId, data) {
    return updateOrderTransaction(orderId, data);
}

const deleteOrderTransaction =
    db.transaction((orderId) => {
        
        deleteOrderItemsWithOrderId(orderId);
        const result = deleteSingleOrder(orderId);

        return {
            deletedRows: result.changes
        }
    }); 
    
function deleteOrder(orderId) {
    return deleteOrderTransaction(orderId);
}    

function getOrderById(id) {

    const stmt = db.prepare(`
        SELECT
                o.id AS orderId,
                o.status,
                o.created_at AS createdAt,
                o.total_amount AS totalAmount,

                u.id AS userId,
                u.first_name,
                u.last_name
            FROM orders o
            JOIN users u ON u.id = o.user_id
            WHERE o.id = ?
        `);

    const result = stmt.get(id);
    return result;
}

function getOrderItems(orderId) {

    const stmt = db.prepare(`
        SELECT
            oi.product_id AS productId,
            p.name AS productName,
            oi.quantity,
            oi.unit_price AS unitPrice,
            (oi.quantity * oi.unit_price) AS subtotal
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        WHERE oi.order_id = ?
    `);

    return stmt.all(orderId);
}

async function getOrderById_test(id) {
    const rez = await get(
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

            //itemsCount += item.quantity;
        }

        const resultItems = Object.values(grouped);

        const itemsCount = resultItems.reduce(
            (sum, item) => sum + item.quantity, 0
        );
    return rez;
}

module.exports = {
    getOrderById_test,
    getOrders,
    createOrder,
    getOrderById,
    getOrderItems,
    updateOrderTotal,
    updateOrder,
    deleteOrder
};