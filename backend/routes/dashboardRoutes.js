const express = require('express');
const { getKpiOverview, getFilteredKpis,  getKpiAnalyticsHandler } = require('../controllers/dashboardController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router =express.Router()




router.get('/overview',authMiddleware, getKpiOverview)
router.get('/kpi/filter', authMiddleware,getFilteredKpis);
router.get('/kpi/analytics', authMiddleware,getKpiAnalyticsHandler);
module.exports = router;
