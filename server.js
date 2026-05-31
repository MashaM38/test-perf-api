const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API works");
});

const db = new sqlite3.Database("./database.db");

app.get("/users", (req, res) => {

    db.all(
        "SELECT * FROM users",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);
        }
    );

});

app.get("/orders", (req, res) => {

    db.all(
        "SELECT * FROM orders",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);
        }
    );

});

app.get("/products", (req, res) => {

    db.all(
        "SELECT * FROM products",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);
        }
    );

});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});