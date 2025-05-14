const express = require('express');
const { roleMiddleware, authMiddleware } = require('../middlewares/authMiddleware');
const { getAllUsers, createUser, deleteUser, updateUser, getUsersById } = require('../controllers/userController');
const { getMyKpis, updateMyKpiProgress } = require('../controllers/kpiController');
const router = express.Router()

router.post('/user', authMiddleware,roleMiddleware(['admin']), createUser)
router.get('/users', authMiddleware,roleMiddleware(['admin']),getAllUsers)
router.get('/user/:id', authMiddleware,roleMiddleware(['admin']),getUsersById)
router.put('/user/:id', authMiddleware, roleMiddleware(['admin']), updateUser)
router.delete('/user/:id', authMiddleware, roleMiddleware(['admin']), deleteUser)

router.get('/my-users/:id',authMiddleware, getMyKpis)
router.put('/my-users/kpis/:kpiId', authMiddleware, updateMyKpiProgress);
module.exports = router