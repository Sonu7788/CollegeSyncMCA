const express = require('express');
const mongoose = require('mongoose');
const classroomRoutes = require('./routes/classrooms');
const sessionRoutes = require('./routes/sessions');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for file uploads
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// DB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/college-sync')
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ DB Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/users', require('./routes/users'));
app.use('/api/classrooms', classroomRoutes);
app.use('/api/sessions', sessionRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));