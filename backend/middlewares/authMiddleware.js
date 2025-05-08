const jwt = require('jsonwebtoken')
const { User } = require('../models/userModel')

exports.authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization') 
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' })
    }

    try {
        const jwtToken = token.split(" ")[1]
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET)

        console.log('Decoded JWT:', decoded)  // เช็คว่าได้อะไร
        req.user = decoded  // ไม่ต้อง .user แล้ว

        next()  
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid' })
    }
}


exports.roleMiddleware = (roles) => {
    return (req, res, next) => {
      console.log(req.user);
  
      const userRole = req.user.role;
      const roleMapping = {
        1: 'admin',
        2: 'user',
      };
  
      const roleName = roleMapping[userRole];
  
      if (!roles.includes(roleName)) {
        return res.status(403).json({ message: 'Permission denied' });
      }
  
      next();  
    };
  };
  