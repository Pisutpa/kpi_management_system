// models/kpiModel.js
const pool = require('./db')

exports.createKPI = async (data) => {
  const {
    title,
    description,
    target_value,
    actual_value = 0.00,
    status,
    assigned_user,
    start_date,
    end_date
  } = data

  const res = await pool.query(
    `INSERT INTO kpis 
    (title, description, target_value, actual_value, status, assigned_user, start_date, end_date) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
    RETURNING *`,
    [title, description, target_value, actual_value, status, assigned_user, start_date, end_date]
  )
  return res.rows[0]
}


exports.getAllKPIs = async () => {
  const res = await pool.query('SELECT * FROM kpis')
  return res.rows
}

exports.getKPIById = async (id) => {
  const res = await pool.query('SELECT * FROM kpis WHERE id = $1', [id])
  return res.rows[0]
}

exports.updateKPI = async (id, data) => {
  const {
    title,
    description,
    target_value,
    actual_value,
    status,
    assigned_user,
    start_date,
    end_date
  } = data

  const res = await pool.query(
    `UPDATE kpis SET 
      title = $1,
      description = $2,
      target_value = $3,
      actual_value = $4,
      status = $5,
      assigned_user = $6,
      start_date = $7,
      end_date = $8,
      updated_at = NOW()
    WHERE id = $9
    RETURNING *`,
    [title, description, target_value, actual_value, status, assigned_user, start_date, end_date, id]
  )
  return res.rows[0]
}

exports.getKpisByUser = async (userId) => {
  try {
    const res = await pool.query('SELECT * FROM kpis WHERE assigned_user = $1', [userId])
    return res.rows
  } catch (err) {
    throw new Error('Error fetching KPIs from database')
  }
}
exports.findKpiByIdAndUserId = async (kpiId, userId) => {

  try {
    if (!kpiId || isNaN(kpiId)) {
      throw new Error('Invalid KPI ID')
    }

    const res = await pool.query('SELECT * FROM kpis WHERE id = $1 and assigned_user = $2 ', [kpiId, userId])

    if (res.rows.length === 0) {
      throw new Error('KPI not found')
    }

    return res.rows[0]
  } catch (err) {
    console.error('Error fetching KPI:', err.message)
    throw new Error('Error fetching KPI: ' + err.message)
  }
}

exports.deleteKPI = async (id) => {
  try {
    const result = await pool.query('DELETE FROM kpis WHERE id = $1', [id])

    if (result.rowCount > 0) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error('Error deleting KPI:', error)
    throw new Error('Database error during KPI deletion')
  }
}




exports.updateKpiProgress = async (kpiId, updatedValue) => {
  await pool.query(
    'UPDATE kpis SET actual_value = $1, updated_at = NOW() WHERE id = $2',
    [updatedValue, kpiId]
  )
}

exports.addKpiUpdateLog = async (kpiId, updatedValue, comment, userId) => {
  await pool.query(
    `INSERT INTO kpi_updates (kpi_id, updated_value, comment, updated_by) 
     VALUES ($1, $2, $3, $4)`,
    [kpiId, updatedValue, comment, userId]
  )
}

exports.getKpiAnalytics = async () => {
  try {

    const result = await pool.query('SELECT * FROM kpis')
    const kpis = result.rows


    const totalKpis = kpis.length


    const achievedKpis = kpis.filter(kpi => kpi.actual_value >= kpi.target_value).length


    const achievementPercentage = totalKpis > 0 ? (achievedKpis / totalKpis) * 100 : 0


    const trendData = kpis.map(kpi => ({
      date: kpi.updated_at,
      value: kpi.actual_value
    }))

    return { achievementPercentage, trendData }
  } catch (err) {
    throw new Error('Error fetching KPI analytics: ' + err.message)
  }
}

exports.getAllKPIsAndUser = async () => {
  const res = await pool.query(`
    SELECT kpis.*, users.*
    FROM kpis
    JOIN users ON kpis.assigned_user = users.id
  `)
  return res.rows
}
