const express = require ('express');

const router = express.Router();

const analyticsController = require('../controllers/analyticsController');

router.get('/popular-products', analyticsController.getAnalyticsPopularProducts);

module.exports = router;
