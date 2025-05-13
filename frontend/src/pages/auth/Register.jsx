import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({


    username: '',
    email: '',
    password: ''

  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });


  };

  const handleSubmit = async (e) => {
    e.preventDefault()
 if (form.password !== form.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    console.log(form);
    try {
      const res = await axios.post('http://localhost:5000/api/register', form)
      console.log(res.data)
      toast.success('Registration successful!')
      navigate('/')
    } catch (error) {
      const errMsg = error.response?.data?.message
      toast.error(errMsg);
      console.log(error);

    }

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

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
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">confirmPassword</label>
          <input
          
            type="password"
            name="confirmPassword"
           
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
