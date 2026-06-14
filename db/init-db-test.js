const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database_test.db");

module.exports = db;

db.serialize(() => {

    db.run(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT,
            registration_date TEXT DEFAULT CURRENT_TIMESTAMP,
            status TEXT,
            last_login TEXT
        );    
    `);

    //console.log("Users table created");

    // PRODUCTS
    db.run(`
        CREATE TABLE products (
            id INTEGER PRIMARY KEY,
            name TEXT,
            category TEXT,
            price REAL,
            stock INTEGER,
            description TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // ORDERS
    db.run(`
        CREATE TABLE orders (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            status TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            total_amount REAL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
    `);

    // ORDER_ITEMS
    db.run(`
        CREATE TABLE order_items (
            id INTEGER PRIMARY KEY,
            order_id INTEGER,
            product_id INTEGER,
            quantity INTEGER,
            unit_price REAL,
            FOREIGN KEY(order_id) REFERENCES orders(id),
            FOREIGN KEY(product_id) REFERENCES products(id)
        );
    `);

    console.log("All tables created successfully");
});

db.close();
