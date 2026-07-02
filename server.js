const express = require("express");

const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const orderItemsRoutes = require('./routes/orderItems');
const analyticsRoutes = require('./routes/analytics');

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order_items', orderItemsRoutes);
app.use('/api/analytics', analyticsRoutes);


app.get("/", (req, res) => {
    res.send("API works");
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
});

module.exports = app;
