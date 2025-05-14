// controllers/authController.js
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { createUser, findUserByUsername } = require('../models/userModel')
const pool = require('../models/db')
const userModel = require('../models/userModel')

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
    if (!user) return res.status(400).json({ message: 'Invalid Username' })

    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) return res.status(400).json({ message: 'Invalid Password' })
      const payload = {
        id:user.id,
        username:user.username,
        role:user.role_id
       }
      const token = jwt.sign(payload, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
      )

    res.json({ payload,token })

  } catch (err) {
    console.error('Error logging in user:', err)
    res.status(500).json({ error: err.message })
  }
}

exports.currentUser = async (req, res) => {
  try {
    const user = await userModel.findUserById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}