const sqlite3 = require("sqlite3").verbose();
const { faker } = require("@faker-js/faker");

const db = new sqlite3.Database("./database.db");



function createUsers(count) {
    for(let i = 0; i < count; i++) {

        db.run(
        "INSERT INTO users(name,email) VALUES(?,?)",
        [
            faker.person.fullName(),
            faker.internet.email()
        ]
        );
    }
}    

/*for(let i = 0; i < 5; i++) {

    db.run(
      "INSERT INTO users(name,email) VALUES(?,?)",
      [
        faker.person.fullName(),
        faker.internet.email()
      ]
    );

} */

function createProducts(count) {

    const stmt = db.prepare(
        "INSERT INTO products(name, price) VALUES (?, ?)"
    );

    for (let i = 0; i < count; i++) {
        stmt.run(
            faker.commerce.productName(),
            faker.commerce.price({ min: 10, max: 200 })
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

function createOrders(userIds, productIds, count = 7) {

    const stmt = db.prepare(
        "INSERT INTO orders(user_id, product_id, quantity, created_at) VALUES (?, ?, ?, ?)"
    );

    for (let i = 0; i < count; i++) {

        const userId = userIds[Math.floor(Math.random() * userIds.length)];
        const productId = productIds[Math.floor(Math.random() * productIds.length)];
        const created_at = new Date().toISOString();

        stmt.run(
            userId,
            productId,
            Math.floor(Math.random() * 5) + 1,
            created_at
        );
    }

    stmt.finalize();
}

async function generate_data() {

    console.log("Seeding started...");

    createUsers(3);
    createProducts(5);

    const userIds = await getUsers();

    const productIds = await new Promise((resolve, reject) => {
        db.all("SELECT id FROM products", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows.map(r => r.id));
        });
    });

    createOrders(userIds, productIds, 7);

    console.log("Data generated");

    db.close();
}

generate_data();