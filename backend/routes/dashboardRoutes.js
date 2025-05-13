const express = require('express');
const { getKpiOverview} = require('../controllers/dashboardController');


const router =express.Router()




router.get('/overview', getKpiOverview)



module.exports = router;
