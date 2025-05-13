
const kpiModel = require('../models/kpiModel')


exports.createKpi = async (req, res) => {
  const { title, description, target_value, actual_value, status, assigned_user, start_date, end_date } = req.body
  try {
    const newKpi = await kpiModel.createKPI({ title, description, target_value, actual_value, status, assigned_user, start_date, end_date })
    res.status(201).json(newKpi)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


exports.getKpis = async (req, res) => {
    try {
   
      const kpis = await kpiModel.getAllKPIs()
      console.log(kpis)
      
      res.json(kpis)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  exports.getKpisByid = async(req,res)=>{
    const { id } = req.params
    console.log('Received ID:', id)
    try {
      const kpi = await kpiModel.getKPIById(id)
      if (!kpi) {
        return res.status(404).json({ message: 'KPI not found' })
      }
      res.json(kpi)
    } catch (error) {
      res.status(500).json({ message: error.message })
        
    }
  }

// อัปเดต KPI
exports.updateKpi = async (req, res) => {
    const { id } = req.params
    const { title, description, target_value, actual_value, status, assigned_user, start_date, end_date } = req.body
  
    try {
      const updatedKpi = await kpiModel.updateKPI(id, { title, description, target_value, actual_value, status, assigned_user, start_date, end_date })
  
      if (!updatedKpi) {
        return res.status(404).json({ message: 'KPI not found' })
      }
  
      res.json(updatedKpi)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

exports.removeKpi = async (req, res) => {
    const { id } = req.params
    try {
      const result = await kpiModel.deleteKPI(id)
      if (!result) {
        return res.status(404).json({ message: 'KPI not found' })
      }
  
      res.json({ message: 'KPI deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }


exports.getMyKpis = async (req, res) => {
  const userId = req.params.id
  
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    const kpis = await kpiModel.getKpisByUser(userId)
    if (kpis.length === 0) {
      return res.status(404).json({ message: 'No KPIs found for this user' })
    }
    res.json(kpis)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching KPIs', error: err.message })
  }
}
exports.updateMyKpiProgress = async (req, res) => {
  const userId = req.user.id
  const { kpiId } = req.params
  const { updatedValue, comment } = req.body

  if (updatedValue === undefined || updatedValue === null) {
    return res.status(400).json({ message: 'updatedValue is required' })
  }



  try {
    const kpi = await kpiModel.findKpiByIdAndUserId(kpiId, userId)
    if (!kpi) {
      return res.status(404).json({ message: 'KPI not found' })
    }
    await kpiModel.updateKpiProgress(kpiId, updatedValue)
    await kpiModel.addKpiUpdateLog(kpiId, updatedValue, comment, userId)

    res.json({ message: 'KPI progress updated successfully' })
  } catch (err) {
    console.error('Error:', err.message)
    res.status(500).json({ message: 'Error updating KPI', error: err.message })
  }
}





exports.getAllKpis = async () => {
  return await kpiModel.getAllKPIs()
};
