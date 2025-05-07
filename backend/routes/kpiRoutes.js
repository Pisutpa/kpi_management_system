const express =require('express')
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware')
const router = express.Router()
const { createKpi, getKpis, updateKpi,  getKpisByid, removeKpi } = require('../controllers/kpiController');


router.post('/kpi', authMiddleware,roleMiddleware(['admin']), createKpi)
router.get('/kpis', authMiddleware, getKpis)
router.get('/kpi/:id', authMiddleware, getKpisByid)
router.put('/kpi/:id', authMiddleware, roleMiddleware(['admin']), updateKpi)
router.delete('/kpi/:id', authMiddleware, roleMiddleware(['admin']), removeKpi)

module.exports = router
