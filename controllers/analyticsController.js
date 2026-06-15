const analyticsService = require('../services/analyticsService');

async function getAnalyticsPopularProducts(req, res) {
    try {
            const popularProducts = analyticsService.getAnalyticsPopularProducts();
            console.log(popularProducts);
            res.json(popularProducts);
        } catch(err) {
            res.status(500).json({
                error: err.message
            })
        }
}


module.exports = {
    getAnalyticsPopularProducts
};

