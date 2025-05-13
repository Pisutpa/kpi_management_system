const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getUsersById = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await userModel.getUserById(userId)
    res.json(user)  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.createUser = async (req, res) => {
  const { username, email, password, role_id } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    

    const newUser = await userModel.createUser(username, email, hashedPassword, role_id)
    res.status(201).json(newUser)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.updateUser = async (req, res) => {
  const userId = req.params.id
  const { username, email, password, role_id } = req.body
  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null
    const updatedUser = await userModel.updateUser(userId, { username, email, passwordHash: hashedPassword, role_id })
    res.json(updatedUser)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.deleteUser = async (req, res) => {
  const userId = req.params.id
  try {
    const user = await userModel.getUserById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    await userModel.deleteUser(userId)
    res.json({ message: 'User deleted successfully', username: user.username })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
