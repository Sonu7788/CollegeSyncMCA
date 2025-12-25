import React, { useState } from 'react';
import axios from 'axios';

export default function LoginPage({ onLogin, onToggle }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      onLogin(res.data);
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-96">
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Login</h2>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text" placeholder="Username" required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={e => setFormData({...formData, username: e.target.value})}
        />
        <input
          type="password" placeholder="Password" required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={e => setFormData({...formData, password: e.target.value})}
        />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
          Sign In
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        New here? <button onClick={onToggle} className="text-blue-600 font-semibold hover:underline">Register</button>
      </p>
    </div>
  );
}