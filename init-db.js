// const sqlite3 = require("sqlite3").verbose();

// const db = new sqlite3.Database("./database.db");

// module.exports = db;

// db.serialize(() => {

//     db.run(`
//         CREATE TABLE IF NOT EXISTS users (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT NOT NULL,
//             email TEXT NOT NULL UNIQUE
//         )
//     `);

//     //console.log("Users table created");

//     // PRODUCTS
//     db.run(`
//         CREATE TABLE IF NOT EXISTS products (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT NOT NULL,
//             price REAL NOT NULL
//         )
//     `);

//     // ORDERS
//     db.run(`
//         CREATE TABLE IF NOT EXISTS orders (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             user_id INTEGER NOT NULL,
//             product_id INTEGER NOT NULL,
//             quantity INTEGER NOT NULL,
//             created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

//             FOREIGN KEY (user_id) REFERENCES users(id),
//             FOREIGN KEY (product_id) REFERENCES products(id)
//         )
//     `);

//     console.log("All tables created successfully");
// });

// db.close();