const express = require ('express');

const router = express.Router();

const { getAnalyticsPopularProducts } = require('../controllers/analyticsController');

router.get('/popular-products', getAnalyticsPopularProducts);

module.exports = router;
