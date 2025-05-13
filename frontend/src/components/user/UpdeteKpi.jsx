import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { updateKpiUserApi } from "../../api/KpiApi"
import { getUserKpisApi } from "../../api/UpdateKpiUserApi"
import useKpiStore from "../../store/kpi-store"

const UpdateKpiUser = () => {
    const navigate = useNavigate()
    const token = useKpiStore((state) => state.token)
    const currentUser = useKpiStore((state) => state.user)

    const initialForm = {
        updatedValue: '',
        comment: ''
    }

    const [form, setForm] = useState(initialForm)
    const [loading, setLoading] = useState(false)
    const [kpiData, setKpiData] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editingKpiId, setEditingKpiId] = useState(null)

    useEffect(() => {
        if (token  && currentUser) {
            fetchKpi(token, currentUser.id)
        }else if(!token || !currentUser){
               navigate("/")
        }
    }, [token, currentUser])

    const fetchKpi = async (token, id) => {
        try {
            const res = await getUserKpisApi(token, id)
            if (res.status === 200) {
                const data = res.data
                setKpiData(data)
                setForm({
                    updatedValue: data.updatedValue || '',
                    comment: data.comment || ''
                })
            } else {
                toast.error('ไม่พบข้อมูล KPI')
            }
        } catch (error) {
            toast.error('เกิดข้อผิดพลาดในการดึงข้อมูล KPI')
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        // e.preventDefault()
        setLoading(true)
console.log(form);

        try {
         
            await updateKpiUserApi(token, editingKpiId, form)
            toast.success('อัปเดต KPI สำเร็จ')
             navigate('/user/my-users/')
        } catch (error) {
            toast.error('เกิดข้อผิดพลาดในการอัปเดต KPI')
        } finally {
            setLoading(false)
        }
    }

    const handleEditClick = (kpi) => {
        if (isEditing && editingKpiId === kpi.id) {
            setIsEditing(false)
            setForm({ updatedValue: '', comment: '', id: null })
            setEditingKpiId(null)
        } else {
            setIsEditing(true)
            setForm({
                id: kpi.id,
                updatedValue: kpi.updatedValue,
                comment: kpi.comment
            })
            setEditingKpiId(kpi.id)
        }
    }

    return (
        <div className="container mx-auto p-4 bg-white shadow-md">
            <h1 className="text-xl font-semibold mb-4">รายละเอียด KPI ของคุณ</h1>

            {!!kpiData ? (
                <div className="mb-6">
                    <table className="w-full text-sm border">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="py-2 px-4 border text-center">No.</th>
                                <th className="p-2 border">KPI Name</th>
                                <th className="p-2 border">Target Value</th>
                                <th className="p-2 border">Actual Value</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(kpiData) && kpiData.map((kpi, index) => (
                                <tr key={kpi.id}>
                                    <td className="py-2 px-4 border text-center">{index + 1}</td>
                                    <td className="p-2 border">{kpi.title}</td>
                                    <td className="p-2 border">{kpi.target_value}</td>
                                    <td className="p-2 border">{kpi.actual_value}</td>
                                    <td className="p-2 border">{kpi.status}</td>
                                    <td className="p-2 border">
                                        <button
                                            onClick={() => handleEditClick(kpi)}
                                            className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            {isEditing && editingKpiId === kpi.id ? 'ยกเลิกแก้ไข' : 'แก้ไข KPI'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>กำลังโหลดข้อมูล KPI...</p>
            )}

            {isEditing && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Updated Value</label>
                        <input
                            type="number"
                            name="updatedValue"
                            value={form.updatedValue}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Comment</label>
                        <textarea
                            name="comment"
                            value={form.comment}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? 'กำลังอัปเดต...' : 'อัปเดต KPI'}
                    </button>
                </form>
            )}
        </div>
    )
}

export default UpdateKpiUser
