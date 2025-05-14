import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import useKpiStore from "../../store/kpi-store"
import { readKpiApi, updateKpiApi } from "../../api/KpiApi"
import { useParams, useNavigate } from "react-router-dom"

const FormEditKpi = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const token = useKpiStore((state) => state.token)
    const listuser = useKpiStore((state) => state.listuser)
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

    const [form, setForm] = useState(initialForm)
    const [loading, setLoading] = useState(false)

    const resetForm = () => {
        setForm(initialForm)
    }

    useEffect(() => {
        if (token) {
            getKpi(token)  
            fetchUser(token, id) 
        }
    }, [token, getKpi, id])

    const fetchUser = async (token, id) => {
        try {
            const res = await readKpiApi(token, id)
            setForm(res.data) 
        } catch (error) {
            console.error("Error fetching KPI:", error)
            toast.error("เกิดข้อผิดพลาดในการดึงข้อมูล KPI")
        }
    }

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
            await updateKpiApi(token, id, cleanForm)
            toast.success('KPI ได้รับการแก้ไขสำเร็จ!')
            resetForm()  // Reset the form after successful update
            navigate('/admin/kpi/')
        } catch (error) {
            const errMsg = error.response?.data?.message || 'เกิดข้อผิดพลาด'
            toast.error(errMsg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-4 bg-white shadow-md">
            <h1 className="text-xl font-semibold mb-4">Edit KPI</h1>
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
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    )
};

export default FormEditKpi;
