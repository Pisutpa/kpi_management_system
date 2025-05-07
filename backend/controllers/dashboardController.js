const kpiModel = require('../models/kpiModel')
const pool = require('../models/db')

exports.getKpiOverview = async (req, res) => {
    try {
      const kpis = await kpiModel.getAllKPIs()
  
      if (!kpis || kpis.length === 0) {
        return res.status(404).json({ message: 'No KPIs found' })
      }
  
      const totalKpis = kpis.length  
      const achievedKpis = kpis.filter(kpi => kpi.actual_value >= kpi.target_value).length
      const achievementPercentage = (achievedKpis / totalKpis) * 100
  
      const statusOverview = {
        onTrack: kpis.filter(kpi => kpi.status === 'On Track').length,
        atRisk: kpis.filter(kpi => kpi.status === 'At Risk').length,
        offTrack: kpis.filter(kpi => kpi.status === 'Off Track').length
      }
  
      res.json({
        totalKpis,             
        achievedKpis,
        achievementPercentage,
        statusOverview,
        kpis
      })
  
    } catch (err) {
      res.status(500).json({ message: 'Error fetching KPI overview', error: err.message })
    }
  }
  




  exports.getFilteredKpis = async (req, res) => {
    const { userId, status, category } = req.query
  

    let query = 'SELECT * FROM kpis WHERE 1=1'  
  
   
    if (userId) {
      query += ' AND assigned_user = $1'
      params.push(userId)
    }
  

    if (status) {
      query += ' AND status = $2'
      params.push(status)
    }
  
  
    if (category) {
      query += ' AND category = $3'  
      params.push(category)
    }
  
    try {
     
      const result = await pool.query(query, params)
    } catch (err) {
      res.status(500).json({ message: 'Error fetching filtered KPIs', error: err.message })
    }
  }
  

  exports.getKpiAnalyticsHandler = async (req, res) => {
    try {
      const analytics = await kpiModel.getKpiAnalytics()
      res.json(analytics)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }
  