// controllers/authController.js
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { createUser, findUserByUsername } = require('../models/userModel')
const pool = require('../models/db')

exports.register = async (req, res) => {
  const { username, email, password } = req.body
  try {
    const existing = await findUserByUsername(username)
    if (existing) return res.status(400).json({ message: 'Username exists' })

    const hashedPassword = await bcrypt.hash(password, 10)


    const roleRes = await pool.query("SELECT id FROM roles WHERE name='user'")
    const roleId = roleRes.rows[0].id



    const user = await createUser(username, email, hashedPassword, roleId)
    res.status(201).json({ message: 'User registered', user: { id: user.id, username: user.username } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await findUserByUsername(username)
    console.log(user)
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })
      const payload = {
        id:user.id,
        user:user.username,
        role:user.role_id
       }
      const token = jwt.sign(payload, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
      )

    res.json({ payload,token })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

