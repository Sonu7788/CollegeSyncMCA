import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

export default function StudentDashboard({ user }) {
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [notes, setNotes] = useState([]);
  const [apps, setApps] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [activeTab, setActiveTab] = useState('classes');

  // Inputs
  const [joinClassCode, setJoinClassCode] = useState('');
  const [joinEventCode, setJoinEventCode] = useState('');
  const [newApp, setNewApp] = useState({ className: '', subject: '', toTeacherId: '', details: '', image: '' });
  
  // Stats
  const [overallAttendance, setOverallAttendance] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

 const fetchData = async () => {
    try {
      // --- UPDATED CALLS (Removed 'http://localhost:5000/api') ---
      const [cRes, eRes, nRes, aRes, tRes] = await Promise.all([
        api.get(`/classrooms?role=student&userId=${user._id}`),
        api.get(`/events?role=student&branch=${user.branch}`),
        api.get(`/notes?branch=${user.branch}`),
        api.get(`/applications?userId=${user._id}&role=student`),
        api.get(`/applications/teachers/list?branch=${user.branch}&course=${user.course}`)
      ]);
      setClasses(cRes.data);
      setEvents(eRes.data);
      setNotes(nRes.data);
      setApps(aRes.data);
      setTeachers(tRes.data);
    } catch (err) { console.error(err); }
  };

  // Function to calculate attendance across ALL classes (from all teachers)
  const calculateOverallAttendance = async (classList) => {
    let totalSessionsHeld = 0;
    let totalAttended = 0;

    // Iterate through all classes the student is in
    for (const cls of classList) {
      try {
        const sRes = await axios.get(`http://localhost:5000/api/sessions/class/${cls._id}`);
        const sessions = sRes.data;
        
        totalSessionsHeld += sessions.length;
        
        // Count how many times this student appears in these sessions
        const attendedCount = sessions.filter(s => s.attendedBy.includes(user._id)).length;
        totalAttended += attendedCount;
      } catch (err) {
        console.error(err);
      }
    }

    const percent = totalSessionsHeld === 0 ? 0 : Math.round((totalAttended / totalSessionsHeld) * 100);
    setOverallAttendance(percent);
  };

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

   const handleJoinClass = async (classId) => {
    try {
      // UPDATED CALL
      const allSessions = await api.get(`/sessions/class/${classId}`);
      const latestSession = allSessions.data[0]; 
      if(!latestSession) return alert("No active session for this class yet.");
      // UPDATED CALL
      await api.post('/sessions/join', { sessionId: latestSession._id, code: joinClassCode, studentId: user._id });
      alert('Class Attendance Marked!');
      setJoinClassCode('');
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleJoinEvent = async (eventId) => {
    if(!joinEventCode) return alert('Enter code');
    try {
      // UPDATED CALL
      await api.post('/events/join', { eventId, code: joinEventCode, studentId: user._id });
      alert('Event Attendance Marked!');
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await toBase64(file);
      setNewApp({ ...newApp, image: base64 });
    }
  };

  const submitApp = async (e) => {
    e.preventDefault();
    try {
      // UPDATED CALL
      await api.post('/applications', {
        studentId: user._id, studentName: user.fullName, studentBranch: user.branch, ...newApp
      });
      alert('Application Submitted');
      setNewApp({ className: '', subject: '', toTeacherId: '', details: '', image: '' });
      fetchData();
    } catch (err) { alert('Error'); }
  };
  const downloadFormalApplication = (app) => {
    if (app.status !== 'Approved') return;
    const doc = new jsPDF();
    
    doc.setFontSize(18); doc.text("COLLEGE SYNC ERP", 105, 20, null, null, "center");
    doc.setFontSize(14); doc.text("APPLICATION FORM", 105, 30, null, null, "center");
    doc.setLineWidth(0.5); doc.line(20, 35, 190, 35);
    
    doc.setFontSize(12);
    let y = 50;
    doc.text(`Date: ${new Date(app.approvedAt).toLocaleDateString()}`, 140, y);
    y += 10;
    doc.text(`To,`, 20, y); y += 10;
    doc.text(`The Principal/HOD`, 20, y); y += 10;
    doc.text(`College Sync Institute`, 20, y); y += 20;
    
    doc.text(`Subject: Application for ${app.subject}`, 20, y); y += 20;
    doc.text(`Respected Sir/Madam,`, 20, y); y += 10;
    
    const splitDetails = doc.splitTextToSize(`I, ${app.studentName}, a student of class ${app.className} (${user.course}), would like to bring to your kind attention that: \n\n${app.details}`, 150);
    doc.text(splitDetails, 20, y);
    y += (splitDetails.length * 7) + 20;
    doc.text("Therefore, I kindly request you to grant me the necessary permission.", 20, y); y += 20;
    doc.text("Thank You.", 20, y); y += 20;

    doc.text(`Yours Faithfully,`, 20, y + 10);
    doc.text(`${app.studentName}`, 20, y + 20);
    doc.text(`Roll No: ${user.username}`, 20, y + 25);
    doc.text(`Approved By: ${app.approvedBy}`, 140, y + 10);
    
    doc.save(`Formal_App_${app.subject}.pdf`);
  };

  return (
    <div>
      {/* Overall Stats Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg shadow-md mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Hello, {user.fullName}</h2>
          <p className="text-blue-100">Course: {user.branch} - {user.course}</p>
        </div>
        <div className="text-right">
          <p className="text-sm uppercase tracking-wider text-blue-200">Overall Attendance</p>
          <p className="text-4xl font-bold">{overallAttendance}%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b pb-2 overflow-x-auto">
        {['My Classes', 'Events', 'Notes', 'Applications'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-4 py-2 rounded-lg font-semibold text-sm md:text-base whitespace-nowrap ${activeTab === tab.toLowerCase() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* --- Classes Tab --- */}
      {activeTab === 'my classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map(cls => (
            <div key={cls._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
              <h4 className="font-bold text-lg">{cls.name}</h4>
              <p className="text-sm text-gray-600">{cls.branch} - {cls.course}</p>
              <div className="mt-4 space-y-2">
                <input type="text" placeholder="Attendance Code" className="w-full p-2 border rounded" value={joinClassCode} onChange={e => setJoinClassCode(e.target.value)} />
                <button onClick={() => handleJoinClass(cls._id)} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Mark Present</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Events Tab --- */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(ev => (
            <div key={ev._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              {ev.logo && <img src={ev.logo} alt="logo" className="h-40 w-full object-cover" />}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{ev.title}</h3>
                  {ev.isMustJoin && <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded font-bold">Must Join</span>}
                </div>
                <p className="text-gray-500 text-sm mt-1">{new Date(ev.dateTime).toLocaleString()}</p>
                <p className="text-gray-600 mt-2 text-sm">{ev.details}</p>
                
                {!ev.attendedBy.includes(user._id) ? (
                  <div className="mt-4 flex gap-2">
                    <input type="text" placeholder="Event Code" className="border p-2 rounded flex-1 text-sm" value={joinEventCode} onChange={e => setJoinEventCode(e.target.value)} />
                    <button onClick={() => handleJoinEvent(ev._id)} className="bg-green-600 text-white px-3 py-2 rounded text-sm">Join</button>
                  </div>
                ) : (
                  <div className="mt-4 text-green-600 font-bold text-sm">✅ Attended</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Notes Tab --- */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => (
            <div key={note._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-t-4 border-blue-500">
              <h3 className="font-bold text-lg mb-2">{note.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{note.details}</p>
              <a href={note.file} download={`Note_${note.title}.pdf`} className="block w-full text-center bg-blue-50 text-blue-600 py-2 rounded border border-blue-200 hover:bg-blue-100">
                Download Material
              </a>
            </div>
          ))}
        </div>
      )}

      {/* --- Applications Tab --- */}
      {activeTab === 'applications' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-xl mb-4 text-slate-700">New Formal Application</h3>
            <form onSubmit={submitApp} className="space-y-4">
              <input type="text" placeholder="Class Name" className="w-full p-2 border rounded" value={newApp.className} onChange={e => setNewApp({...newApp, className: e.target.value})} required />
              <input type="text" placeholder="Subject of Application" className="w-full p-2 border rounded" value={newApp.subject} onChange={e => setNewApp({...newApp, subject: e.target.value})} required />
              <select className="w-full p-2 border rounded" value={newApp.toTeacherId} onChange={e => setNewApp({...newApp, toTeacherId: e.target.value})} required>
                <option value="">To Teacher</option>
                {teachers.map(t => <option key={t._id} value={t._id}>{t.fullName}</option>)}
              </select>
              <textarea placeholder="Full Details / Reason..." className="w-full p-2 border rounded h-24" value={newApp.details} onChange={e => setNewApp({...newApp, details: e.target.value})} required></textarea>
              
              <div className="p-3 bg-gray-50 rounded border border-dashed border-gray-300">
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (Optional)</label>
                <input type="file" onChange={handleImageChange} className="w-full text-sm"/>
                {newApp.image && <p className="text-xs text-green-600 mt-1">✅ Image ready</p>}
              </div>

              <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-900">Submit</button>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-xl mb-4 text-slate-700">My Applications History</h3>
            {apps.map(app => (
              <div key={app._id} className={`p-4 rounded-lg shadow border-l-4 ${app.status === 'Approved' ? 'border-green-500 bg-green-50' : app.status === 'Rejected' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-white'}`}>
                <div className="flex justify-between">
                  <h4 className="font-bold">{app.subject}</h4>
                  <span className="text-sm font-semibold uppercase">{app.status}</span>
                </div>
                <p className="text-sm text-gray-600">To: {teachers.find(t => t._id === app.toTeacherId)?.fullName || 'Teacher'}</p>
                {app.image && <p className="text-xs text-blue-500 mt-1">📎 Has Attachment</p>}
                {app.status === 'Approved' && (
                  <button onClick={() => downloadFormalApplication(app)} className="mt-2 text-sm underline text-blue-600">Download Formal Copy</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}