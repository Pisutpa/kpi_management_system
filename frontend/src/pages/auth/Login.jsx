import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useKpiStore from '../../store/kpi-store';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const actionLogin = useKpiStore((state) => state.actionLogin);
  const user = useKpiStore((state) => state.user);
  console.log(user);

  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await actionLogin(form);
      console.log(res.data);

      const role = res.data.payload.role;
      console.log(role);

      toast.success('Login successful!');

      roleRedirect(role);

    } catch (error) {
      const errMsg = error.response?.data.message;
      toast.error(errMsg);
    }
  };
 
  const roleRedirect = (role) => {
    const numericRole = parseInt(role);
    if (numericRole === 1) {
      navigate('/admin');
    } else {
      navigate('/user');
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

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

      
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
