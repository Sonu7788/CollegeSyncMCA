import React, { useState } from 'react';
// CHANGE: Importing centralized api file
import api from './api';

export default function LoginPage({ onLogin, onToggle }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // CHANGE: Using 'api' instead of 'axios' and removed hardcoded URL
      const res = await api.post('/auth/login', formData);
      
      // If successful, pass user data up to App.js
      onLogin(res.data);
    } catch (err) {
      console.error(err);
      // Display error message (401 status from backend or network error)
      const message = err.response?.data?.message || 'Invalid username or password';
      setError(message);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold text-slate-800">Login</h2>
        <p className="text-sm text-gray-500 mt-1">Welcome Back to College Sync</p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input 
            type="text" 
            placeholder="Enter your username" 
            required 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
            value={formData.username} 
            onChange={e => setFormData({...formData, username: e.target.value})} 
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            placeholder="•••••••" 
            required 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
            value={formData.password} 
            onChange={e => setFormData({...formData, password: e.target.value})} 
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold shadow-md transition transform hover:scale-[1.02]"
        >
          Sign In
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        New to College Sync? 
        <button onClick={onToggle} className="ml-1 text-indigo-600 font-bold hover:underline focus:outline-none">Register</button>
      </p>
    </div>
  );
}