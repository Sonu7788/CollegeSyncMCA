import React, { useState } from 'react';
import axios from 'axios';

export default function RegisterPage({ onRegister, onToggle }) {
  const [formData, setFormData] = useState({ username: '', password: '', fullName: '', role: 'student', branch: 'CSE' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Registration Successful! Please Login.');
      onToggle(); // Switch back to login
    } catch (err) {
      alert('Error registering user');
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-96">
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Full Name" required className="w-full p-3 border rounded-lg" onChange={e => setFormData({...formData, fullName: e.target.value})} />
        <input type="text" placeholder="Username" required className="w-full p-3 border rounded-lg" onChange={e => setFormData({...formData, username: e.target.value})} />
        <input type="password" placeholder="Password" required className="w-full p-3 border rounded-lg" onChange={e => setFormData({...formData, password: e.target.value})} />
        
        <div className="flex gap-2">
          <select className="w-1/2 p-3 border rounded-lg" onChange={e => setFormData({...formData, role: e.target.value})}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <select className="w-1/2 p-3 border rounded-lg" onChange={e => setFormData({...formData, branch: e.target.value})}>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="MECH">MECH</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition">
          Create Account
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account? <button onClick={onToggle} className="text-blue-600 font-semibold hover:underline">Login</button>
      </p>
    </div>
  );
}