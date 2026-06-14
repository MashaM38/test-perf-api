const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const analyticsRoutes = require('./routes/analytics');

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);


app.get("/", (req, res) => {
    res.send("API works");
});

const db = new sqlite3.Database("./database_test.db");

app.get("/api/order_items", (req, res) => {

    db.all(
        "SELECT * FROM order_items",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);
        }
    );

});



app.listen(8080, () => {
    console.log("Server running on port 8080");
});

module.exports = app;
