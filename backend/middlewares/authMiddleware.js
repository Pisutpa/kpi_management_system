const jwt = require('jsonwebtoken')
const { User } = require('../models/userModel')

exports.authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')  // รับค่า token จาก header
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' })
    }

    try {
        // แยก token ออกเป็น Bearer token
        const jwtToken = token.split(" ")[1]

        // Verify token ด้วย JWT_SECRET
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET)
        
        // บันทึกข้อมูลผู้ใช้ใน req.user
        req.user = decoded.user
        
        next()  // ให้ไปยัง middleware หรือ route ถัดไป
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid' })
    }
}


exports.roleMiddleware = (roles)=>{
return (req,res,next)=>{
    console.log(req.user)
    const userRole = req.user.role
    const roleMapping = {
        1: 'admin',  
        2: 'user',   
    }

    const roleName = roleMapping[userRole]
    if (!roles.includes(roleName)) {
        return res.status(403).json({ message: 'Permission denied' }) 
    }

    if (roleName !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
    next()

}
}