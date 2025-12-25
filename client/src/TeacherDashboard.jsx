import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from './api';
export default function TeacherDashboard({ user }) {
  const [apps, setApps] = useState([]);
  
  // Class & Session State
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [sessions, setSessions] = useState([]);
  const [studentReport, setStudentReport] = useState([]); // NEW: Detailed Student Report
  const [dailyCode, setDailyCode] = useState('');
  
  // Form States
  const [newEvent, setNewEvent] = useState({ title: '', logo: '', details: '', dateTime: '', isMustJoin: false, branches: '', code: '' });
  const [newNote, setNewNote] = useState({ title: '', details: '', branches: '', file: '' });
  const [newClass, setNewClass] = useState({ name: '' });
  const [studentUsername, setStudentUsername] = useState('');

  // Branch Data (Fixed according to requirements)
  const branchData = {
    'Computer Application': ['BCA-1', 'BCA-2', 'BCA-3', 'MCA-1', 'MCA-2'],
    'Business Administrative': ['BBA-1', 'BBA-2', 'BBA-3', 'MBA-1', 'MBA-2'],
    'BTech': ['Btech-1', 'Btech-2', 'Btech-3']
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

 const fetchInitialData = async () => {
    try {
      // --- UPDATED CALLS ---
      const [cRes, eRes, aRes] = await Promise.all([
        api.get(`/classrooms?role=teacher&userId=${user._id}`),
        api.get(`/events?role=teacher&userId=${user._id}`),
        api.get(`/applications?userId=${user._id}&role=teacher`)
      ]);
      setClasses(cRes.data);
      setEvents(eRes.data);
      setApps(aRes.data);
    } catch (err) { console.error(err); }
  };

  const [events, setEvents] = useState([]);

  // --- Class Management ---
   const createClass = async () => {
    try {
      // UPDATED CALL
      await api.post('/classrooms', { 
        name: newClass.name, 
        branch: user.branch, 
        course: user.course, 
        teacherId: user._id 
      });
      alert('Class Created');
      setNewClass({ name: '' });
      fetchInitialData();
    } catch (err) { alert('Error'); }
  };

  const addStudentToClass = async (classId) => {
    if(!studentUsername) return alert('Enter username');
    try {
      // UPDATED CALL
      await api.post(`/classrooms/${classId}/add-student`, { username: studentUsername });
      alert('Student Added');
      setStudentUsername('');
      fetchInitialData();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

 const startClassSession = async () => {
    if(!selectedClassId) return alert('Select a class first');
    const code = Math.floor(1000 + Math.random() * 9000).toString(); 
    setDailyCode(code); 
    try {
      // UPDATED CALL
      await api.post('/sessions', { classroomId: selectedClassId, code });
      alert(`Session Started! Code: ${code}`);
      fetchSessionsAndReport(selectedClassId);
    } catch (err) { alert('Error'); }
  };
  // NEW: Fetch Sessions AND Calculate Student Report
 const fetchSessionsAndReport = async (classId) => {
    try {
      // UPDATED CALLS
      const [sRes, cRes] = await Promise.all([
        api.get(`/sessions/class/${classId}`),
        api.get(`/classrooms?role=teacher&userId=${user._id}`)
      ]);
      
      const sessions = sRes.data;
      setSessions(sessions);

      const selectedClass = cRes.data.find(c => c._id === classId);
      
      if (selectedClass && sessions.length > 0) {
        // Calculate attendance for each student
        const report = selectedClass.studentIds.map(student => {
          const attendedCount = sessions.filter(s => s.attendedBy.includes(student._id)).length;
          const totalSessions = sessions.length;
          const percent = Math.round((attendedCount / totalSessions) * 100);
          return {
            name: student.fullName,
            username: student.username,
            attended: attendedCount,
            total: totalSessions,
            percent: percent
          };
        });
        setStudentReport(report);
      } else {
        setStudentReport([]);
      }
    } catch (err) { console.error(err); }
  };

  // --- File Helper ---
  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleFile = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await toBase64(file);
    if(type === 'logo') setNewEvent({...newEvent, logo: base64});
    if(type === 'note') setNewNote({...newNote, file: base64});
  };

  // --- Event & Note Logic ---
    const createEvent = async (e) => {
    e.preventDefault();
    try {
      const branches = newEvent.branches ? newEvent.branches.split(',') : [user.branch];
      // UPDATED CALL
      await api.post('/events', { 
        ...newEvent, 
        attendanceCode: newEvent.code, 
        branches, 
        createdBy: user._id 
      });
      alert('Event Created');
      setNewEvent({ title: '', logo: '', details: '', dateTime: '', isMustJoin: false, branches: '', code: '' });
      fetchInitialData();
    } catch (err) { alert('Error creating event'); }
  };

  const uploadNote = async (e) => {
    e.preventDefault();
    try {
      const branches = newNote.branches ? newNote.branches.split(',') : [user.branch];
      // UPDATED CALL
      await api.post('/notes', { ...newNote, branches, uploadedBy: user._id });
      alert('Note Uploaded');
      setNewNote({ title: '', details: '', branches: '', file: '' });
    } catch (err) { alert('Error'); }
  };

  const updateApp = async (id, status) => {
    try {
      // UPDATED CALL
      const teacherData = { approvedBy: user.fullName, teacherSignature: user.signature };
      await api.patch(`/applications/${id}`, { status, ...teacherData });
      fetchInitialData();
    } catch (err) { alert('Error'); }
  };

  return (
    <div className="space-y-8 p-4">
      
      {/* Section 1: Classroom Management */}
      <div className="bg-white p-6 rounded-lg shadow border-t-4 border-indigo-500">
        <h3 className="font-bold text-xl mb-4">Classroom Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Create New Class</h4>
            <p className="text-xs text-gray-500 mb-2">Target: {user.branch} ({user.course})</p>
            <div className="flex gap-2">
              <input type="text" placeholder="Subject Name" className="border p-2 rounded w-full" value={newClass.name} onChange={e => setNewClass({...newClass, name: e.target.value})} />
              <button onClick={createClass} className="bg-indigo-600 text-white px-4 py-2 rounded">Create</button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Add Student</h4>
            <div className="flex gap-2">
              <select className="border p-2 rounded w-1/2" onChange={e => { setSelectedClassId(e.target.value); fetchSessionsAndReport(e.target.value); }}>
                <option value="">Select Class</option>
                {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <input type="text" placeholder="Student Username" className="border p-2 rounded flex-1" value={studentUsername} onChange={e => setStudentUsername(e.target.value)} />
              <button onClick={() => addStudentToClass(selectedClassId)} className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Attendance & Records */}
      <div className="bg-white p-6 rounded-lg shadow border-t-4 border-yellow-500">
        <h3 className="font-bold text-xl mb-4">Daily Attendance & Records</h3>
        
        <div className="flex items-center gap-4 mb-6">
          <button onClick={startClassSession} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded shadow">
            Start Today's Class
          </button>
          {dailyCode && <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded font-mono text-xl">CODE: {dailyCode}</div>}
        </div>

        {/* Student Report View (New) */}
        {selectedClassId && studentReport.length > 0 && (
          <div className="mb-8">
            <h4 className="font-bold text-lg mb-3">Student Attendance Report</h4>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present/Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentReport.map((student, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name}
                        <div className="text-xs text-gray-500">{student.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.attended} / {student.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.percent >= 75 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {student.percent}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Session History Table */}
        <div className="overflow-x-auto">
          <h4 className="font-bold text-lg mb-3">Class History (Dates)</h4>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map(s => (
                <tr key={s._id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{new Date(s.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono">{s.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{s.attendedBy.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Create Event */}
      <div className="bg-white p-6 rounded-lg shadow border-t-4 border-purple-500">
        <h3 className="font-bold text-xl mb-4">Create Event</h3>
        <form onSubmit={createEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Event Title" className="p-2 border rounded" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} required />
          <label className="flex items-center gap-2 p-2 border rounded"><input type="checkbox" checked={newEvent.isMustJoin} onChange={e => setNewEvent({...newEvent, isMustJoin: e.target.checked})} /> Must Join?</label>
          <input type="datetime-local" className="p-2 border rounded" value={newEvent.dateTime} onChange={e => setNewEvent({...newEvent, dateTime: e.target.value})} required />
          <input type="text" placeholder="Event Attendance Code" className="p-2 border rounded" value={newEvent.code} onChange={e => setNewEvent({...newEvent, code: e.target.value})} required />
          <textarea placeholder="Details" className="p-2 border rounded md:col-span-2" value={newEvent.details} onChange={e => setNewEvent({...newEvent, details: e.target.value})} required />
          <input type="file" onChange={e => handleFile(e, 'logo')} className="p-2 border rounded" />
          <button type="submit" className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700">Publish Event</button>
        </form>
      </div>

      {/* Section 4: Upload Note */}
      <div className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-500">
        <h3 className="font-bold text-xl mb-4">Upload Notes</h3>
        <form onSubmit={uploadNote} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Note Title" className="p-2 border rounded" value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})} required />
          <input type="file" onChange={e => handleFile(e, 'note')} className="p-2 border rounded" required />
          <textarea placeholder="Details" className="p-2 border rounded md:col-span-2" value={newNote.details} onChange={e => setNewNote({...newNote, details: e.target.value})} required />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 md:col-span-2">Upload Material</button>
        </form>
      </div>
      
      {/* Section 5: Pending Applications */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-bold text-xl mb-4 text-slate-700">Pending Applications</h3>
        {apps.filter(a => a.status === 'Pending').length === 0 ? <p className="text-gray-500">No pending applications.</p> : (
          <div className="grid gap-4">
            {apps.filter(a => a.status === 'Pending').map(app => (
              <div key={app._id} className="border p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="font-bold text-lg">{app.subject}</p>
                  <p className="text-sm text-gray-600">Student: {app.studentName} ({app.studentBranch})</p>
                  <p className="text-sm italic text-gray-500 mt-1">"{app.details}"</p>
                  {app.image && <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Has Image</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateApp(app._id, 'Approved')} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Approve</button>
                  <button onClick={() => updateApp(app._id, 'Rejected')} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}