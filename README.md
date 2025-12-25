🎓 College Sync ERP
A comprehensive, full-stack College Management System built with the MERN stack. It facilitates seamless interaction between teachers and students, handling attendance, class management, events, study materials, and formal applications.

🚀 Features
For Teachers
Class Management: Create classes and enroll students by username.
Daily Attendance: Start live sessions with unique 4-digit codes.
Attendance Report: Real-time view of student attendance percentages.
Events & Notes: Create college events and upload PDF/Word study materials.
Application Approvals: Review student applications, approve/reject them, and generate formal PDFs.
For Students
Join Classes: Mark attendance for live classes using the daily code.
Join Events: Participate in college events using event codes.
Access Materials: Download notes and view upcoming events.
Formal Applications: Submit leave or request forms with optional image attachments and download approved copies.
My Stats: View overall attendance percentage across all enrolled classes.
🛠 Tech Stack
Frontend: React.js, Tailwind CSS, Axios, jsPDF
Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
📋 Prerequisites
Node.js installed on your machine.
MongoDB installed locally OR a MongoDB Atlas account.
🏃 Local Setup
Clone the repository
git clone https://github.com/your-username/college-sync.gitcd college-sync
Backend Setup
cd servernpm install
Configure BackendCreate a .env file inside the server folder:
MONGO_URI=mongodb://localhost:27017/college-syncPORT=5000
Frontend SetupOpen a new terminal in the root folder:
cd clientnpm install
Run the Application
Terminal 1 (Backend):
cd servernode server.js
Terminal 2 (Frontend):
cd clientnpm start
Access the App
Frontend: http://localhost:3000
Backend: http://localhost:5000