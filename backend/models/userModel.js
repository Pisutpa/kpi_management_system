// models/userModel.js
const pool = require('./db');

exports.createUser = async (username, email, passwordHash, roleId) => {
  const res = await pool.query(
    'INSERT INTO users (username, email, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [username, email, passwordHash, roleId]
  );
  return res.rows[0];
};

exports.findUserByUsername = async (username) => {
  const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return res.rows[0];
};


