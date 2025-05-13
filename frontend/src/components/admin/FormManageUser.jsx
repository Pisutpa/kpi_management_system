import React, { useState, useEffect } from "react"
import { createUserApi, removeUserApi } from "../../api/manageUserApi"
import { toast } from "react-toastify"
import useKpiStore from "../../store/kpi-store"
import { Link } from "react-router-dom"
import { SquarePen, Trash2 } from "lucide-react"


const initialForm = {
    username: '',
    email: '',
    password: '',
    role_id: ''
}


const FormManageUser = () => {
    const token = useKpiStore((state) => state.token)
    const listuser = useKpiStore((state) => state.listuser)
    const getUser = useKpiStore((state) => state.getUser)

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentKpis = listuser.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(listuser.length / itemsPerPage);

    const [form, setForm] = useState(initialForm)
    useEffect(() => {
        if (token) {
            getUser(token)
        }
    }, [token, getUser])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }
    const resetForm = () => setForm(initialForm)
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.role_id) {
            toast.error("Please select a valid role.")
            return
        }
        try {
            const res = await createUserApi(token, form)
            toast.success('Create successful!')
            resetForm()
            getUser(token)
        } catch (error) {
            const errMsg = error.response?.data?.message
            toast.error(errMsg || 'เกิดข้อผิดพลาด')
        }
    }

    const handleRemove = async (id) => {
        const confirmDelete = window.confirm('ยืนยันการลบข้อมูลนี้ใช่หรือไม่?')
        if (!confirmDelete) return

        try {
            const res = await removeUserApi(token, id)
            toast.success(`ลบผู้ใช้งาน ${res.data.username} สำเร็จ`)
            getUser(token)
        } catch (error) {
            toast.error('เกิดข้อผิดพลาดในการลบข้อมูล')
        }
    }

    return (
        <div className="container mx-auto p-4 bg-white shadow-md">
            <h1 className="text-xl font-semibold mb-4">User Management</h1>
            <form onSubmit={handleSubmit} className="my-4">
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">Password</label>
                    <input
                        type="taxt"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">ประเภทผู้ใช้งาน</label>
                    <select
                        name="role_id"
                        value={form.role_id}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mt-2"
                        required
                    >
                        <option value="">Select role</option>
                        <option value="1">Admin</option>
                        <option value="2">User</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Create
                </button>
                <hr />
                <br />
                <table className="min-w-full table-auto">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border text-center">NO.</th>
                            <th className="py-2 px-4 border text-center">ชื่อ</th>
                            <th className="py-2 px-4 border text-center">ประเภทผู้ใช้งาน</th>
                            <th className="py-2 px-4 border text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(listuser) && listuser.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, index) => (
                            <tr key={item.id}>
                                <td className="py-2 px-4 border text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td className="py-2 px-4 border text-center">{item.username}</td>
                                <td className="py-2 px-4 border text-center">
                                    {item.role_id === 1 ? 'Admin' : item.role_id === 2 ? 'User' : '-'}
                                </td>
                                <td className="py-2 px-4 border text-center flex gap-2 justify-center">
                                    <Link to={'/admin/manage/' + item.id} className="bg-yellow-500 rounded-md p-1 shadow-md  text-white" ><SquarePen /></Link>
                                    <button onClick={() => handleRemove(item.id)} className="bg-red-500 rounded-md p-1 shadow-md  text-white"><Trash2 /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex gap-2 items-center mt-4">
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

            </form>
        </div>
    )
}

export default FormManageUser
