  const createEvent = async (e) => {
    e.preventDefault();
    try {
      const branches = newEvent.branches ? newEvent.branches.split(',') : [user.branch];
      
      await axios.post('https://collegesyncmca.onrender.com', { 
        ...newEvent, 
        attendanceCode: newEvent.code, // <--- THIS LINE FIXES THE ERROR
        branches, 
        createdBy: user._id 
      });
      
      alert('Event Created');
      setNewEvent({ title: '', logo: '', details: '', dateTime: '', isMustJoin: false, branches: '', code: '' });
      fetchInitialData();
    } catch (err) { alert('Error creating event'); }
  };