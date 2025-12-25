import React, { useState } from 'react';
// CHANGE: Importing the centralized api file
import api from './api';

export default function RegisterPage({ onRegister, onToggle }) {
  const [formData, setFormData] = useState({ 
    username: '', password: '', fullName: '', role: 'student', branch: '', course: '' 
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state

  // Data Structure defined in prompt
  const branchData = {
    'Computer Application': ['BCA-1', 'BCA-2', 'BCA-3', 'MCA-1', 'MCA-2'],
    'Business Administrative': ['BBA-1', 'BBA-2', 'BBA-3', 'MBA-1', 'MBA-2'],
    'BTech': ['Btech-1', 'Btech-2', 'Btech-3']
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.branch || !formData.course) {
      setError("Please select both Branch and Course");
      setLoading(false);
      return;
    }
    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters");
      setLoading(false);
      return;
    }

    try {
      // CHANGE: Using 'api' instead of 'axios'
      const res = await api.post('/auth/register', formData);
      
      // On Success
      alert('Registration Successful! You can now login.');
      setLoading(false);
      onToggle(); // Switch to Login view
    } catch (err) {
      // Error Handling
      console.error(err);
      // Check if backend sends specific error message
      const message = err.response?.data?.message || err.response?.data || 'Error registering user';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold text-slate-800">Register</h2>
        <p className="text-sm text-gray-500 mt-1">Join College Sync ERP</p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" 
            placeholder="John Doe" 
            required 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
            value={formData.fullName} 
            onChange={e => setFormData({...formData, fullName: e.target.value})} 
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input 
            type="text" 
            placeholder="john_doe" 
            required 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
            value={formData.username} 
            onChange={e => setFormData({...formData, username: e.target.value})} 
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            required 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
            value={formData.password} 
            onChange={e => setFormData({...formData, password: e.target.value})} 
          />
        </div>

        {/* Role & Branch Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              onChange={e => setFormData({...formData, role: e.target.value})}
              value={formData.role}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              onChange={(e) => setFormData({...formData, branch: e.target.value, course: ''})}
              value={formData.branch}
            >
              <option value="">Select Branch</option>
              {Object.keys(branchData).map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Selection (Dependent on Branch) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
          <select 
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition ${!formData.branch ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-300'}`} 
            onChange={e => setFormData({...formData, course: e.target.value})} 
            disabled={!formData.branch}
            value={formData.course}
          >
            <option value="">{formData.branch ? 'Select Course' : 'Select Branch First'}</option>
            {formData.branch && branchData[formData.branch].map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white transition transform hover:scale-[1.02] ${loading ? 'bg-gray-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg'}`}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account? 
        <button onClick={onToggle} className="ml-1 text-indigo-600 font-bold hover:underline focus:outline-none">Login</button>
      </p>
    </div>
  );
}