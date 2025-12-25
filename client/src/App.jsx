import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    const storedUser = localStorage.getItem('collegeSyncUser');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('collegeSyncUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('collegeSyncUser');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        {view === 'login' ? (
          <LoginPage onLogin={handleLogin} onToggle={() => setView('register')} />
        ) : (
          <RegisterPage onRegister={handleLogin} onToggle={() => setView('login')} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-slate-800 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">🎓 College Sync</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm bg-slate-700 px-3 py-1 rounded-full">
            {user.role.toUpperCase()} | {user.branch}
          </span>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm transition">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {user.role === 'student' ? (
          <StudentDashboard user={user} />
        ) : (
          <TeacherDashboard user={user} />
        )}
      </main>
    </div>
  );
}

export default App;