const sqlite3 = require("sqlite3").verbose();
const { faker } = require("@faker-js/faker");
const Faker = require("faker/lib");

const db = new sqlite3.Database("./database_test.db");



function createUsers(count) {

    const stmt = db.prepare(
        `INSERT INTO users (first_name, last_name, email, phone, registration_date, status, last_login)
        VALUES (?, ?, ?, ?, ?, ?, ?)`
    );

    for(let i = 0; i < count; i++) {

        // db.run(`
        //     INSERT INTO users (first_name, last_name, email, phone, registration_date, status, last_login)
        //     VALUES (?, ?, ?, ?, ?, ?, ?)
        // `, [
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
    stmt.finalize();
}

function createProducts(count) {

    const stmt = db.prepare(
        `INSERT INTO products (name, category, price, stock, description, created_at) \
        VALUES (?, ?, ?, ?, ?, ?)`
    );

    for (let i = 0; i < count; i++) {
        stmt.run(
            faker.commerce.productName(),
            faker.commerce.department(),
            faker.number.float({ min: 10, max: 2000 }),
            faker.number.int({ min: 0, max: 100 }),
            faker.commerce.productDescription(),
            //faker.date.past().toISOString()
            new Date().toISOString()
        );
    }

    stmt.finalize();
}  

function getUsers() {
    return new Promise((resolve, reject) => {

        db.all("SELECT id FROM users", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows.map(r => r.id));
        });

    });
}

function getProducts() {
    return new Promise((resolve, reject) => {

        db.all("SELECT id, price FROM products", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows.map(r => r.id));
        });

    });
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {

        db.get(sql, params, (err, row) => {

            if (err) {
                reject(err);
                return;
            }

            resolve(row);

        });

    });
}

function run(sql, params = []) {
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

function createOrders(userIds, count) {

    const stmt = db.prepare(
        "INSERT INTO orders (user_id, status, created_at, total_amount) VALUES (?, ?, ?, ?)"
    );

    for (let i = 0; i < count; i++) {

        const userId = randomItem(userIds).id;
        //const productId = productIds[Math.floor(Math.random() * productIds.length)];
        const created_at = new Date().toISOString();

        stmt.run(
            userId,
            'completed',
            created_at,
            0
        );
    }

    stmt.finalize();

    const orderId = stmt.lastID; //get created order ID
}


function createOrderItems(productIds, count = 3) {

    const stmt = db.prepare(
        "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)"
    );

    for (let i = 0; i < count; i++) {

        const product = randomItem(productIds);
        const productId = product.id;
        const unitPrice = product.price;

        stmt.run(
            orderId,
            productId,
            faker.number.int({ min: 1, max: 5 }),
            unitPrice
        );
    }

    stmt.finalize();

    const orderId = stmt.lastID; //get created order ID
}

// 5 items - to start
function createOrdersAndItems() {
    for (let i = 0; i < 5; i++) {
    //const userId = faker.number.int({ min: 1, max: 1000 });

    //select 1 random user
    const user = db.prepare(`
        SELECT id
        FROM users
        ORDER BY RANDOM()
        LIMIT 1
    `).get();
    console.log("1 random user is selected");

    db.run(`
        INSERT INTO orders (user_id, status, created_at, total_amount)
        VALUES (?, ?, ?, ?)
    `, [
        user.id,
        'completed',
        faker.date.recent().toISOString(),
        0
    ], function () {
        console.log("Order is generated");
        const orderId = this.lastID;
        let total = 0;

        const itemsCount = faker.number.int({ min: 1, max: 5 });

        for (let j = 0; j < itemsCount; j++) {
        //select 1 random product
        const product = db.prepare(`
            SELECT id, price
            FROM products
            ORDER BY RANDOM()
            LIMIT 1
        `).get();
        console.log("1 random product is selected");
        
        const productId = product.id;
        const qty = faker.number.int({ min: 1, max: 3 });
        const price = product.price; //faker.number.float({ min: 10, max: 1000 });

        total += qty * price;

        db.run(`
            INSERT INTO order_items (order_id, product_id, quantity, unit_price)
            VALUES (?, ?, ?, ?)
        `, [orderId, productId, qty, price]);
        }
        console.log("Order_item(s) is/are generated");

        db.run(`
        UPDATE orders SET total_amount = ? WHERE id = ?
        `, [total, orderId]);
        });
        console.log("total amount is updated");
    }
}


async function createOrder() {

    const user = await get(`
        SELECT id
        FROM users
        ORDER BY RANDOM()
        LIMIT 1
    `);

    const result = await run(`
        INSERT INTO orders (
            user_id,
            status,
            created_at,
            total_amount
        )
        VALUES (?, ?, ?, ?)
    `, [
        user.id,
        'completed',
        faker.date.recent().toISOString(),
        0
    ]);

    return {
        orderId: result.lastID,
        userId: user.id
    };
}


async function createOrderItems(orderId) {

    let total = 0;

    const itemsCount =
        faker.number.int({
            min: 1,
            max: 5
        });

    for (let i = 0; i < itemsCount; i++) {

        const product = await get(`
            SELECT id, price
            FROM products
            ORDER BY RANDOM()
            LIMIT 1
        `);

        const qty =
            faker.number.int({
                min: 1,
                max: 3
            });

        const subtotal =
            qty * product.price;

        total += subtotal;

        await run(`
            INSERT INTO order_items (
                order_id,
                product_id,
                quantity,
                unit_price
            )
            VALUES (?, ?, ?, ?)
        `, [
            orderId,
            product.id,
            qty,
            product.price
        ]);
    }

    return total;
}

async function updateTotal(
    orderId,
    total
) {

    await run(`
        UPDATE orders
        SET total_amount = ?
        WHERE id = ?
    `, [
        total,
        orderId
    ]);

}

async function createOneOrder() {

    const order =
        await createOrder();

    const total =
        await createOrderItems(
            order.orderId
        );

    await updateTotal(
        order.orderId,
        total
    );

}


async function createOrdersAndItems() {

    for (let i = 0; i < 5; i++) {

        await createOneOrder();

        console.log(
            `Order ${i + 1} created`
        );
    }

}

async function generate_data() {

    db.serialize(() => {

    console.log("Data generation started...");

    //createUsers(3);
    //console.log("Users generated");
    
    //createProducts(5);
    //console.log("Products generated");

    //const userIds = await getUsers();

    /*const productIds = await new Promise((resolve, reject) => {
        db.all("SELECT id FROM products", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows.map(r => r.id));
        });
    });
    */

    //createOrders(userIds, productIds, 7);

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

    //db.close();
}


async function generate_test_data() {

    try {

        console.log(
            "Data generation started"
        );

        createUsers(2);
        console.log("Users generated");
    
        createProducts(2);
        console.log("Products generated");

        await createOrdersAndItems();

        console.log(
            "Data generation completed"
        );

    } catch (err) {

        console.error(err);

    } finally {

        db.close(err => {

            if (err) {
                console.error(err);
            } else {
                console.log(
                    "Database closed"
                );
            }

        });

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

//Generate_data;
generate_test_data();

//Delete all data
//delete_all_tables();

//Create indexes
//create_indexes();

module.exports = db;
