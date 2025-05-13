import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import useKpiStore from "../../store/kpi-store"
import { createKpiApi, KpiCSV, KpiPDF, removeKpiApi } from "../../api/KpiApi"
import { Link } from "react-router-dom"
import { SquarePen, Trash2 } from "lucide-react"

const FormManageKpi = () => {
    const token = useKpiStore((state) => state.token)
    const listuser = useKpiStore((state) => state.listuser)

    const listkpi = useKpiStore((state) => state.listkpi)
    const getKpi = useKpiStore((state) => state.getKpi)
    const initialForm = {
        title: '',
        description: '',
        target_value: '',
        actual_value: '',
        status: '',
        assigned_user: '',
        start_date: '',
        end_date: ''
    }
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentKpis = listkpi.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(listkpi.length / itemsPerPage)



    const [form, setForm] = useState(initialForm)
    const [loading, setLoading] = useState(false)
    const resetForm = () => {
        setForm(initialForm)
    }
    useEffect(() => {
        if (token) {
            getKpi(token)

        }
    }, [token, getKpi])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }



    const handleSubmit = async (e) => {
        e.preventDefault()


        const cleanForm = {
            ...form,
            target_value: form.target_value ? parseFloat(form.target_value) : null,
            actual_value: form.actual_value ? parseFloat(form.actual_value) : null,
            assigned_user: parseInt(form.assigned_user, 10)
        }


        if (!form.title || !form.assigned_user || !form.status) {
            toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            return
        }

        setLoading(true)
        try {
            await createKpiApi(token, cleanForm)
            toast.success('สร้าง KPI สำเร็จ!')
            resetForm()
        } catch (error) {
            const errMsg = error.response?.data?.message
            toast.error(errMsg || 'เกิดข้อผิดพลาด')
        } finally {
            setLoading(false)
        }


    }
    const handleRemove = async (id) => {
        const confirmDelete = window.confirm('ยืนยันการลบข้อมูลนี้ใช่หรือไม่?')
        if (!confirmDelete) return

        try {
            const res = await removeKpiApi(token, id)
            toast.success(`ลบข้อมูลสำเร็จ`)
            getKpi(token)
        } catch (error) {
            toast.error('เกิดข้อผิดพลาดในการลบข้อมูล')
        }
    }
    const renderStatusDot = (status) => {
        let colorClass = ''

        switch (status) {
            case 'On Track':
                colorClass = 'bg-green-500'
                break
            case 'At Risk':
                colorClass = 'bg-yellow-500'
                break
            case 'Off Track':
                colorClass = 'bg-red-500'
                break
            default:
                colorClass = 'bg-gray-400'
        }

        return (
            <span className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${colorClass}`}></span>
                {status}
            </span>
        )
    }
    const exportPDF = async () => {
        try {
            const res = await KpiPDF(token)
            console.log(res)

            if (res.data && res.data.file) {
                console.log(res.data.file)

                window.open(`http://localhost:5000${res.data.file}`, '_blank')
            } else {
                alert('ไม่สามารถสร้าง PDF ได้')
            }
        } catch (err) {
            console.error(err)
            alert('เกิดข้อผิดพลาดในการสร้าง PDF')
        }
    }
    const exportCSV = async () => {
        try {
            const res = await KpiCSV(token)


            const BOM = '\uFEFF'
            const utf8Blob = new Blob([BOM + res.data], { type: 'text/csv;charset=utf-8;' });

            const url = window.URL.createObjectURL(utf8Blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'kpi_report.csv')
            document.body.appendChild(link)
            link.click()

            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error(err)
            alert('เกิดข้อผิดพลาดในการสร้าง CSV')
        }
    };


    return (
        <div className="container mx-auto p-4 bg-white shadow-md">
            <h1 className="text-xl font-semibold mb-4">Create KPI</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        rows="3"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Target Value</label>
                        <input
                            type="number"
                            name="target_value"
                            value={form.target_value}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Actual Value</label>
                        <input
                            type="number"
                            name="actual_value"
                            value={form.actual_value}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">Status</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">เลือกสถานะ</option>
                        <option value="On Track">On Track</option>
                        <option value="At Risk">At Risk</option>
                        <option value="Off Track">Off Track</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">Assigned User</label>
                    <select
                        name="assigned_user"
                        value={form.assigned_user}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">เลือกผู้รับผิดชอบ</option>
                        {Array.isArray(listuser) && listuser.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Start Date</label>
                        <input
                            type="date"
                            name="start_date"
                            value={form.start_date}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">End Date</label>
                        <input
                            type="date"
                            name="end_date"
                            value={form.end_date}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    {loading ? 'Saving...' : 'Create KPI'}
                </button>
            </form>
            <hr />
          
            <div className="p-4 flex gap-2 justify-end">
                <button onClick={exportCSV} className="px-6  text-white  bg-green-500 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl focus:outline-none">
                    ดาวน์โหลดรายงาน CSV
                </button>
                <button onClick={exportPDF} className="px-6  text-white  bg-red-500 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl focus:outline-none">
                    ดาวน์โหลดรายงาน PDF
                </button>
              
 
            </div>


            <table className="min-w-full table-auto">

                <thead>
                    <tr>
                        <th className="py-2 px-4 border text-center">No.</th>
                        <th className="py-2 px-4 border text-center">Title</th>
                        <th className="py-2 px-4 border text-center">Status</th>
                        <th className="py-2 px-4 border text-center">ผู้รับผิดชอบ</th>
                        <th className="py-2 px-4 border text-center">Start Date</th>
                        <th className="py-2 px-4 border text-center">End Date</th>
                        <th className="py-2 px-4 border text-center">จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="7" className="text-center py-4">
                                Loading...
                            </td>
                        </tr>
                    ) : (
                        Array.isArray(currentKpis) && currentKpis.map((kpi, index) => (
                            <tr key={kpi.id}>
                                <td className="py-2 px-4 border text-center">{indexOfFirstItem + index + 1}</td>
                                <td className="py-2 px-4 border">{kpi.title}</td>
                                <td className="py-2 px-4 border text-center">{renderStatusDot(kpi.status)}</td>
                                <td className="py-2 px-4 border text-center">
                                    {Array.isArray(listuser) && listuser.find((user) => user.id === kpi.assigned_user)?.username || '-'}
                                </td>
                                <td className="py-2 px-4 border text-center">{new Date(kpi.start_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                <td className="py-2 px-4 border text-center">{new Date(kpi.end_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                <td className="py-2 px-4 border flex gap-2 justify-center">
                                    <Link to={'/admin/kpi/' + kpi.id} className="bg-yellow-500 rounded-md p-1 shadow-md text-white"><SquarePen /></Link>
                                    <button onClick={() => handleRemove(kpi.id)} className="bg-red-500 rounded-md p-1 shadow-md text-white"><Trash2 /></button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>


            <div className="flex items-center justify-between mt-4">
                <div>
                    <label className="mr-2">แสดงแถว:</label>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                        className="border rounded p-1"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>

                <div className="flex gap-2 items-center">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-1 border rounded disabled:opacity-50"
                    >
                        ก่อนหน้า
                    </button>
                    <span>หน้า {currentPage} / {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-1 border rounded disabled:opacity-50"
                    >
                        ถัดไป
                    </button>
                </div>
            </div>

        </div>
    )
}

export default FormManageKpi
