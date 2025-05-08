// models/userModel.js
const pool = require('./db')

exports.createUser = async (username, email, passwordHash, roleId) => {
  const res = await pool.query(
    'INSERT INTO users (username, email, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [username, email, passwordHash, roleId]
  )
  return res.rows[0]
}

exports.findUserByUsername = async (username) => {
  const res = await pool.query('SELECT * FROM users WHERE username = $1', [username])
  return res.rows[0]
}
exports.findUserById = async (userId) => {
  const res = await pool.query('SELECT id, username, email, role_id FROM users WHERE id = $1', [userId])
  return res.rows[0]
}


exports.getAllUsers = async () => {
  const res = await pool.query('SELECT id, username, email, role_id FROM users');
  return res.rows;
};

exports.updateUser = async (userId, data) => {
  const { username, email, passwordHash, role_id } = data;

  const res = await pool.query(
    `UPDATE users SET 
      username=COALESCE($1, username), 
      email=COALESCE($2, email), 
      password_hash=COALESCE($3, password_hash), 
      role_id=COALESCE($4, role_id), 
      updated_at=NOW()
     WHERE id=$5 RETURNING id, username, email, role_id`,
    [username, email, passwordHash, role_id, userId]
  );
  return res.rows[0];
};

exports.deleteUser = async (userId) => {
  await pool.query('DELETE FROM users WHERE id = $1', [userId]);
};

