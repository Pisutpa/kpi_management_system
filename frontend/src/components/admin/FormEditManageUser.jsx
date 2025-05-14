import React, { useState, useEffect } from "react"
import { createUserApi, listUserApi, readUserApi, updateUserApi } from "../../api/manageUserApi"
import { toast } from "react-toastify"
import useKpiStore from "../../store/kpi-store"
import { useParams, useNavigate } from "react-router-dom"

const FormEditManageUser = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const token = useKpiStore((state) => state.token)
    const listuser = useKpiStore((state) => state.listuser)
    const getUser = useKpiStore((state) => state.getUser)
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        role_id: ''
    })

    useEffect(() => {
        if (token) {
            getUser(token)
            fetchUser(token, id, form)
        }
    }, [token, getUser])

    const fetchUser = async (token, id, form) => {
        try {
            const res = await readUserApi(token, id, form)
            console.log(res);
            setForm(res.data)
        } catch (error) {
            console.log("fetch data", error);

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
        if (!form.role_id) {
            toast.error("Please select a valid role.")
            return
        }
        try {
            const res = await updateUserApi(token, id, form)
            toast.success('updateUserApisful!')
            getUser(token)
            navigate('/admin/manage/')
        } catch (error) {
            const errMsg = error.response?.data?.message
            toast.error(errMsg || 'เกิดข้อผิดพลาด')
        }
    }

    return (
        <div className="container mx-auto p-4 bg-white shadow-md">
            <h1 className="text-xl font-semibold mb-4">Edit user</h1>
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
                        name="taxt"
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
                    Save Changes
                </button>
                <hr />
                <br />

            </form>
        </div>
    )
}

export default FormEditManageUser
