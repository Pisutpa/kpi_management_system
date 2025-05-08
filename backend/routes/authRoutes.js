// routes/authRoutes.js

const express = require('express')
const { register, login, currentUser } = require('../controllers/authController')
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware')
const router = express.Router()


router.post('/register', register)
router.post('/login', login)
router.post('/current-user', authMiddleware, currentUser)
router.post('/current-admin', authMiddleware, roleMiddleware(['admin']), currentUser)

module.exports = router
