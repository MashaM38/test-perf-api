const db = require('../db/data-seed-test2');

const { get, getAll } = require('./detailsHelper');
const { faker } = require("@faker-js/faker");

function getOrderById(req, res) {
    const id = req.params.id;

    db.get(
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
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    error: 'Order not found'
                });
            }

            res.json(row);
        }
    );
}


async function getOrderById_test(req, res) {
    const id = req.params.id;

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

            //itemsCount += item.quantity;
        }

        const resultItems = Object.values(grouped);

        const itemsCount = resultItems.reduce(
            (sum, item) => sum + item.quantity, 0
        );
        
        res.json({
            id: order.orderId,
            status: order.status,
            createdAt: order.createdAt,
            totalAmount: order.totalAmount,

            user: {
                id: order.userId,
                firstName: order.first_name,
                lastName: order.last_name
            },

            itemsCount: itemsCount,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
}


function getAllOrders(req, res) {
    db.all(
        `
        SELECT *
        FROM orders
        `,
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );
}

async function createOrder(req, res) {
    try {

        //const order = await createNewOrder(req.body);
        const order = await createNewOrder_test(req.body);

        //res.status(201).json(order);
        res.status(201).json(order); //ADD message ORDER CREATED

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
}

async function createNewOrder(data) {
    const { userId, status, items } = data;

    await db.exec("BEGIN TRANSACTION");

    try {

        const result = await db.run(
            `
            INSERT INTO orders(user_id, status)
            VALUES (?, ?, ?)
            `,
            [userId, status, faker.date.recent().toISOString(),]
        );

        const orderId = result.lastID;
        console.log("order ID = " + orderId);

        //let totalAmount = 0;        
        for (const item of items) {

            await db.run(
                `
                INSERT INTO order_items
                (order_id, product_id, quantity)
                VALUES (?, ?, ?)
                `,
                [
                    orderId,
                    item.productId,
                    item.quantity
                ]
            );
        }

        await db.exec("COMMIT");

        return {
            orderId
        };

    } catch (error) {

        await db.exec("ROLLBACK");

        throw error;
    }
}

async function createNewOrder_test(data) {
    const { userId, status, items } = data;

    await db.exec("BEGIN TRANSACTION");

    try {

        // const result = await db.run(
        //     `
        //     INSERT INTO orders(user_id, status, created_at)
        //     VALUES (?, ?, ?)
        //     `,
        //     [userId, status, faker.date.recent().toISOString(),]
        // );

        const orderId = await insertOrder(userId, status, faker.date.recent().toISOString());

        //const orderId = result.lastID;
        console.log("order ID = " + orderId);

        let totalAmount = 0;
        for (const item of items) {

            
            ///////////    product
            const product = await get(
                `
                SELECT price
                FROM products
                WHERE id = ?
                `,
                [item.productId]
            );

            const unitPrice = product.price;

            totalAmount += unitPrice * item.quantity;            
            /////////// end product


            await runQuery(
                `
                INSERT INTO order_items
                (order_id, product_id, quantity, unit_price)
                VALUES (?, ?, ?, ?)
                `,
                [
                    orderId,
                    item.productId,
                    item.quantity, 
                    unitPrice
                ]
            );
            
        }

        await runQuery(
            `
            UPDATE orders
            SET total_amount = ?
            WHERE id = ?
            `,
            [totalAmount, orderId]
        );

        await db.exec("COMMIT");

        return {
            orderId
        };

    } catch (error) {

        await db.exec("ROLLBACK");

        throw error;
    }
}

async function updateOrder_test(req, res) {
    try {

        const orderId = Number(req.params.id);
        const result = await updateSingleOrder(orderId, req.body);

        res.json(result);

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

async function updateSingleOrder(orderId, data) {
    const { status, items } = data;
    console.log("Order ID = " + orderId);

    await db.exec("BEGIN TRANSACTION");

    try {
        await runQuery(
        `
        UPDATE orders
        SET status = ?
        WHERE id = ?
        `,
        [status, orderId]
    );

    await runQuery(
        `
        DELETE FROM order_items
        WHERE order_id = ?
        `,
        [orderId]
    );

    let totalAmount = 0;
    for (const item of items) {

    const product = await get(
        `
        SELECT price
        FROM products
        WHERE id = ?
        `,
        [item.productId]
    );

    const unitPrice = product.price;

    totalAmount += unitPrice * item.quantity;

    await runQuery(
        `
        INSERT INTO order_items
        (
            order_id,
            product_id,
            quantity,
            unit_price
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            orderId,
            item.productId,
            item.quantity,
            unitPrice
        ]
    );
    }

    await runQuery(
    `
    UPDATE orders
    SET total_amount = ?
    WHERE id = ?
    `,
    [
        totalAmount,
        orderId
    ]
    );

    await db.exec("COMMIT");

    } catch (error) {

        await db.exec("ROLLBACK");

        throw error;
    }
}


async function deleteOrder(req, res) {
    try {
        const orderId = Number(req.params.id);
        const result = await deleteOrderAndItems(orderId);

        res.json(result);
    } catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
}

async function deleteOrderAndItems(orderId) {
    await db.exec("BEGIN TRANSACTION");

    try {

        await runQuery(
            `
            DELETE FROM order_items
            WHERE order_id = ?
            `,
            [orderId]
        );

        const result = await runQuery(
            `
            DELETE FROM orders
            WHERE id = ?
            `,
            [orderId]
        );

        await db.exec("COMMIT");

        return {
            deletedRows: result.changes
        };
    }
    catch (error) {

        await db.exec("ROLLBACK");

        throw error;
    }    
   
}    



function insertOrder(userId, status, createdAt) {
    return new Promise((resolve, reject) => {

        db.run(
            "INSERT INTO orders(user_id, status, created_at) VALUES (?, ?, ?)",
            [userId, status, createdAt],
            function(err) {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(this.lastID);
                console.log('last order id = ' + this.lastID);
            }
        );

    });
}

//NOT NEEDED - ALREADY EXISTS
// function getData(sql, params = []) {
//     return new Promise((resolve, reject) => {

//         db.get(sql, params, (err, row) => {

//             if (err) {
//                 reject(err);
//                 return;
//             }

//             resolve(row);
//         });

//     });
// }

function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {

        db.run(sql, params, function(err) {

            if (err) {
                reject(err);
                return;
            }

            resolve({
                lastID: this.lastID,
                changes: this.changes
            });

        });

    });
}

module.exports = {
    getOrderById,
    getOrderById_test,
    getAllOrders,
    createOrder,
    updateOrder_test,
    deleteOrder
};
