const express = require('express')
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware')
const { createKpi, getKpis, updateKpi, getKpisByid, removeKpi, getAllKpis } = require('../controllers/kpiController')
const { Parser } = require('json2csv')
const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')
const {  getAllKPIsAndUser } = require('../models/kpiModel')
const iconv = require('iconv-lite')
const router = express.Router()

router.post('/kpi', authMiddleware, roleMiddleware(['admin']), createKpi)
router.get('/kpis', authMiddleware, roleMiddleware(['admin']), getKpis)
router.get('/kpi/:id', authMiddleware, roleMiddleware(['admin']), getKpisByid)
router.put('/kpi/:id', authMiddleware, roleMiddleware(['admin']), updateKpi)
router.delete('/kpi/:id', authMiddleware, roleMiddleware(['admin']), removeKpi)

router.get('/kpis/export/csv', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
    const kpis = await getAllKPIsAndUser()

    const formatDateToThai = (date) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
        return new Intl.DateTimeFormat('th-TH', options).format(new Date(date))
    }

    const formattedKpis = kpis.map(kpi => ({
        ชื่อ: kpi.title,
        รายละเอียด: kpi.description,
        เป้าหมาย: kpi.target_value,
        ผลจริง: kpi.actual_value,
        สถานะ: kpi.status,
        ผู้รับผิดชอบ: kpi.username,
        วันที่เริ่มต้น: formatDateToThai(kpi.start_date),
        วันที่สิ้นสุด: formatDateToThai(kpi.end_date)
    }))

    const parser = new Parser()
    const csv = parser.parse(formattedKpis)
    
    const encodedCSV = iconv.encode('\uFEFF' + csv, 'utf-8')

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="kpis.csv"')
    res.send(encodedCSV)
})
router.get('/kpis/export/pdf', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
    try {
        const kpis = await getAllKPIsAndUser()

        const doc = new PDFDocument()
        const outputPath = path.join(__dirname, '../exports/kpi_report.pdf')

        doc.pipe(fs.createWriteStream(outputPath))


        doc.font('D:/work long/kpi_management_system/backend/fonts/THSarabunNew.ttf')

        kpis.forEach(kpi => {
            doc.fontSize(12).text(
                `ชื่อ: ${kpi.title}
                รายละเอียด: ${kpi.description}
                เป้าหมาย: ${kpi.target_value}
                ผลลัพธ์จริง: ${kpi.actual_value}
                สถานะ: ${kpi.status}
                ผู้รับผิดชอบ: ${kpi.username}
                วันที่เริ่มต้น: ${formatDateToThai(kpi.start_date)}
                วันที่สิ้นสุด: ${formatDateToThai(kpi.end_date)}\n`,
                { align: 'left' }
            ).moveDown()
        })

        doc.end()

        res.json({ message: 'PDF Generated', file: '/exports/kpi_report.pdf' })
    } catch (err) {
        console.error(err)
        res.status(500).send('ไม่สามารถสร้าง PDF ได้')
    }
})

const formatDateToThai = (date) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
    return new Intl.DateTimeFormat('th-TH', options).format(new Date(date))
}

module.exports = router
