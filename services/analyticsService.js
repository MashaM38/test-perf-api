const analyticsRepository = require('../repositories/analyticsRepository');

function getAnalyticsPopularProducts() {
    console.log("service analytics");
    return analyticsRepository.getAnalyticsPopularProducts();
}

module.exports = {
    getAnalyticsPopularProducts
}