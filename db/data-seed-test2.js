const { faker } = require("@faker-js/faker");
const Faker = require("faker/lib");

const db = require('../db/db-connection');

const createUsers = db.transaction((count) => { 
    const stmt = db.prepare(`
        INSERT INTO users (
            first_name,
            last_name,
            email,
            phone,
            registration_date,
            status,
            last_login
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < count; i++) {
        stmt.run(
            faker.person.firstName(),
            faker.person.lastName(),
            faker.internet.email(),
            faker.phone.number({style: 'international'}),
            faker.date.past().toISOString(),
            'active',
            faker.date.recent().toISOString()
        );
    }
});

const createProducts = db.transaction((count) => { 
    const stmt = db.prepare(`
        INSERT INTO products (name, category, price, stock, description, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < count; i++) {
        stmt.run(
            faker.commerce.productName(),
            faker.commerce.department(),
            faker.number.float({ min: 10, max: 2000 }),
            faker.number.int({ min: 0, max: 100 }),
            faker.commerce.productDescription(),
            new Date().toISOString()
        );
    }
});

function createOrdersAndItems(orderCount) {

    const getRandomUser = db.prepare(`
        SELECT id
        FROM users
        ORDER BY RANDOM()
        LIMIT 1
        `);


    const getRandomProduct = db.prepare(`
        SELECT id, price
            FROM products
            ORDER BY RANDOM()
            LIMIT 1
        `);

    const insertOrder = db.prepare(`
        INSERT INTO orders (user_id, status, created_at, total_amount)
        VALUES (?, ?, ?, ?)
        `);

    const insertOrderItem = db.prepare(`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
            VALUES (?, ?, ?, ?)
        `);
        
    const updateOrderTotal = db.prepare(`
        UPDATE orders SET total_amount = ? WHERE id = ?
        `);

const transaction = db.transaction(() => {
        for (let i = 0; i < orderCount; i++) {

            const user = getRandomUser.get();

            const orderResult = insertOrder.run(
                user.id,
                'completed',
                faker.date.recent().toISOString(),
                0
            );

            const orderId = Number(orderResult.lastInsertRowid);

            let total = 0;

            const itemsCount = faker.number.int({
                min: 1,
                max: 5
            });

            for (let j = 0; j < itemsCount; j++) {
                const product = getRandomProduct.get();
                const qty = faker.number.int({
                    min: 1,
                    max: 3
                });

                total += qty * product.price;

            if (orderId == null || product.id == null || qty <= 0 || product.price <= 0) {
                continue;
            }

                insertOrderItem.run(
                    orderId,
                    product.id,
                    qty,
                    product.price
                );
            }

            updateOrderTotal.run(total, orderId);
        }
    });

    transaction();
}

async function generate_data() {

    db.serialize(() => {
    console.log("Data generation started...");

    createOrdersAndItems();
    console.log("Orders and order_items are generated");

    console.log("Data generated");

        db.close(err => {
            if (err) {
            console.error(err);
            } else {
            console.log('Database closed');
            }
        });
    });
}

function generate_test_data() {
    try {
        console.log("Data generation started");

        createUsers(982);
        console.log("Users generated");

        createProducts(2982);
        console.log("Products generated");

        createOrdersAndItems(9963);
        console.log("Orders generated");

        console.log("Data generation completed");

    } catch (err) {
        console.error(err);

    } finally {
        try {
            db.close();
            console.log("Database closed");
        } catch (err) {
            console.error("Error closing database:", err);
        }
    }
}

function delete_all_tables() {
    db.exec(`
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM products;
    DELETE FROM users;

`);
//TODO:
//DELETE FROM sqlite_sequence
//    WHERE name IN ('order_items', 'orders', 'products', 'users');    

console.log("Data entries are deleted");

}

function deleteRows(startOrderId) {
    const transaction = db.transaction(() => {
    db.prepare(`
        DELETE FROM order_items
        WHERE order_id IN (
        SELECT id FROM orders WHERE id >= ?
        )
    `).run(startOrderId);

    db.prepare(`
        DELETE FROM orders
        WHERE id >= ?
    `).run(startOrderId);
    });

    transaction();
}


function deleteNullRows() {
    const result = db.prepare(`
        DELETE FROM order_items
        WHERE order_id IS NULL
    `).run();
}

function deleteRowsWithId(orderItemId) {
    const result = db.prepare(`
        DELETE FROM order_items
        WHERE order_id = ?
    `).run(orderItemId);
}

function create_indexes() {
    db.exec (`
        CREATE INDEX idx_orders_user_id
        ON orders(user_id);

        CREATE INDEX idx_order_items_order_id
        ON order_items(order_id);

        CREATE INDEX idx_order_items_product_id
        ON order_items(product_id);
        `);
    
    console.log("Indexes are created");    
        
}

async function deleteRowsStartingWithId(startOrderId) {
    const transaction = db.transaction(() => {
    db.prepare(`
        DELETE FROM order_items
        WHERE order_id IN (
        SELECT id FROM orders WHERE id >= ?
        )
    `).run(startOrderId);

    db.prepare(`
        DELETE FROM orders
        WHERE id >= ?
    `).run(startOrderId);
    });

    transaction();
}


//Generate_data;
generate_test_data();

//Delete all data
//delete_all_tables();

//Create indexes
//create_indexes();

//Delete some orders and order items
//deleteRows(36);
//deleteNullRows();
//deleteRowsWithId(24);

module.exports = db;
