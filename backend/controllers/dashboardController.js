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
  




  