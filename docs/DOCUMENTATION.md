# Online Exam Management System - Complete Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Setup Instructions](#setup-instructions)
8. [Deployment Guide](#deployment-guide)

## 🎯 Project Overview

A full-stack Online Exam Management System with three main modules:
- **Student Module**: Take exams, view results
- **System Monitoring Module**: Real-time proctoring and cheating detection
- **Admin/Teacher Module**: Create exams, manage questions, view results

## 🛠️ Tech Stack

### Backend
- **Framework**: Node.js + Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **Security**: bcryptjs, CORS

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Charts**: Recharts
- **Icons**: React Icons
- **PDF Generation**: jsPDF

## ✨ Features

### Student Module
- ✅ Secure login/registration
- ✅ View available exams
- ✅ Take exams with timer
- ✅ MCQ with multiple choice answers
- ✅ Navigation between questions
- ✅ Auto-submit when time expires
- ✅ View results immediately
- ✅ Review answers after submission

### System Monitoring Module
- ✅ Real-time student camera monitoring
- ✅ Cheating detection:
  - Face not visible
  - Multiple faces detected
  - Tab switching detection
  - Window blur detection
  - Fullscreen exit detection
- ✅ Live alert system
- ✅ Send warnings to students
- ✅ Log all suspicious activities
- ✅ Timer control

### Admin/Teacher Module
- ✅ Admin dashboard with statistics
- ✅ Create and manage exams
- ✅ Add/Edit/Delete questions
- ✅ Bulk question import
- ✅ User management (CRUD operations)
- ✅ View all results
- ✅ Export results to PDF/Excel
- ✅ Detailed result analysis
- ✅ Reset student passwords

## 📁 Project Structure

```
online-exam-system/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Exam.js
│   │   ├── Question.js
│   │   ├── Result.js
│   │   └── CheatingLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── exams.js
│   │   ├── questions.js
│   │   ├── results.js
│   │   ├── monitoring.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── ExamCard.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── Timer.jsx
│   │   │   ├── CameraMonitor.jsx
│   │   │   └── ResultChart.jsx
│   │   ├── pages/
│   │   │   ├── student/
│   │   │   │   ├── StudentLogin.jsx
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   ├── TakeExam.jsx
│   │   │   │   ├── ExamResult.jsx
│   │   │   │   └── StudentResults.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ManageExams.jsx
│   │   │   │   ├── CreateExam.jsx
│   │   │   │   ├── ManageQuestions.jsx
│   │   │   │   ├── ViewResults.jsx
│   │   │   │   └── ManageUsers.jsx
│   │   │   └── monitoring/
│   │   │       ├── MonitoringDashboard.jsx
│   │   │       └── ExamMonitoring.jsx
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── socket.js
│   │   │   └── helpers.js
│   │   ├── styles/
│   │   │   └── App.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── database/
    └── schema.md
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['student', 'teacher', 'admin']),
  profileImage: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Exams Collection
```javascript
{
  _id: ObjectId,
  title: String,
  subject: String,
  description: String,
  duration: Number (minutes),
  totalMarks: Number,
  passingMarks: Number,
  scheduledDate: Date,
  startTime: String,
  endTime: String,
  isActive: Boolean,
  randomizeQuestions: Boolean,
  showResults: Boolean,
  allowReview: Boolean,
  createdBy: ObjectId (ref: User),
  questions: [ObjectId] (ref: Question),
  createdAt: Date,
  updatedAt: Date
}
```

### Questions Collection
```javascript
{
  _id: ObjectId,
  examId: ObjectId (ref: Exam),
  questionText: String,
  questionType: String (enum: ['mcq', 'multiselect', 'true-false']),
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: String,
  marks: Number,
  difficulty: String (enum: ['easy', 'medium', 'hard']),
  explanation: String,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Results Collection
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: User),
  examId: ObjectId (ref: Exam),
  answers: [{
    questionId: ObjectId (ref: Question),
    selectedAnswer: String,
    isCorrect: Boolean,
    marksObtained: Number
  }],
  totalScore: Number,
  maxScore: Number,
  percentage: Number,
  isPassed: Boolean,
  startTime: Date,
  submitTime: Date,
  timeTaken: Number (seconds),
  status: String (enum: ['completed', 'submitted', 'auto-submitted']),
  createdAt: Date,
  updatedAt: Date
}
```

### CheatingLogs Collection
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: User),
  examId: ObjectId (ref: Exam),
  alertType: String (enum: [
    'face_not_visible',
    'multiple_faces',
    'tab_switched',
    'window_blur',
    'fullscreen_exit',
    'no_face_detected',
    'suspicious_movement'
  ]),
  description: String,
  severity: String (enum: ['low', 'medium', 'high']),
  timestamp: Date,
  screenshot: String,
  warningsSent: Number,
  isResolved: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Documentation

### Authentication Routes

#### Register User
```
POST /api/auth/register
Body: {
  name: string,
  email: string,
  password: string,
  role: 'student' | 'teacher' | 'admin'
}
Response: { success, token, user }
```

#### Login
```
POST /api/auth/login
Body: { email: string, password: string }
Response: { success, token, user }
```

#### Get Current User
```
GET /api/auth/me
Headers: { Authorization: 'Bearer <token>' }
Response: { success, user }
```

### Exam Routes

#### Get All Exams
```
GET /api/exams
Headers: { Authorization: 'Bearer <token>' }
Response: { success, count, exams }
```

#### Get Single Exam
```
GET /api/exams/:id
Headers: { Authorization: 'Bearer <token>' }
Response: { success, exam }
```

#### Create Exam (Teacher/Admin only)
```
POST /api/exams
Headers: { Authorization: 'Bearer <token>' }
Body: {
  title: string,
  subject: string,
  duration: number,
  scheduledDate: date,
  totalMarks: number,
  ...
}
Response: { success, exam }
```

#### Update Exam (Teacher/Admin only)
```
PUT /api/exams/:id
Headers: { Authorization: 'Bearer <token>' }
Body: { field: value, ... }
Response: { success, exam }
```

#### Delete Exam (Teacher/Admin only)
```
DELETE /api/exams/:id
Headers: { Authorization: 'Bearer <token>' }
Response: { success, message }
```

### Question Routes

#### Get Exam Questions (for taking exam)
```
GET /api/exams/:id/questions
Headers: { Authorization: 'Bearer <token>' }
Response: { success, exam, questions }
```

#### Get Questions (Admin view with answers)
```
GET /api/questions/exam/:examId
Headers: { Authorization: 'Bearer <token>' }
Response: { success, count, questions }
```

#### Create Question
```
POST /api/questions
Headers: { Authorization: 'Bearer <token>' }
Body: {
  examId: string,
  questionText: string,
  options: [{ text: string, isCorrect: boolean }],
  marks: number,
  ...
}
Response: { success, question }
```

#### Bulk Create Questions
```
POST /api/questions/bulk
Headers: { Authorization: 'Bearer <token>' }
Body: {
  examId: string,
  questions: [...]
}
Response: { success, count, questions }
```

### Result Routes

#### Submit Exam
```
POST /api/results/submit
Headers: { Authorization: 'Bearer <token>' }
Body: {
  examId: string,
  answers: [{ questionId: string, selectedAnswer: string }],
  startTime: date
}
Response: { success, result }
```

#### Get Student Results
```
GET /api/results/student/:studentId
Headers: { Authorization: 'Bearer <token>' }
Response: { success, count, results }
```

#### Get Exam Results (Teacher/Admin)
```
GET /api/results/exam/:examId
Headers: { Authorization: 'Bearer <token>' }
Response: { success, count, results }
```

#### Get Result Details
```
GET /api/results/:id
Headers: { Authorization: 'Bearer <token>' }
Response: { success, result }
```

### Monitoring Routes

#### Log Cheating Alert
```
POST /api/monitoring/alert
Headers: { Authorization: 'Bearer <token>' }
Body: {
  examId: string,
  alertType: string,
  description: string,
  severity: 'low' | 'medium' | 'high'
}
Response: { success, log }
```

#### Get Exam Alerts (Teacher/Admin)
```
GET /api/monitoring/exam/:examId
Headers: { Authorization: 'Bearer <token>' }
Response: { success, count, alerts }
```

#### Send Warning to Student
```
POST /api/monitoring/warning/:studentId
Headers: { Authorization: 'Bearer <token>' }
Body: { examId: string, message: string }
Response: { success, message }
```

### User Management Routes (Admin only)

#### Get All Users
```
GET /api/users?role=student&search=john
Headers: { Authorization: 'Bearer <token>' }
Response: { success, count, users }
```

#### Create User
```
POST /api/users
Headers: { Authorization: 'Bearer <token>' }
Body: { name, email, password, role }
Response: { success, user }
```

#### Update User
```
PUT /api/users/:id
Headers: { Authorization: 'Bearer <token>' }
Body: { name, email, role, isActive }
Response: { success, user }
```

#### Delete User
```
DELETE /api/users/:id
Headers: { Authorization: 'Bearer <token>' }
Response: { success, message }
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/exam_management
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud database
```

5. **Run the backend server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API URL**
Create `src/utils/api.js`:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

4. **Run the frontend**
```bash
npm start
```

Frontend will run on `http://localhost:3000`

### Database Seeding (Optional)

Create a seed script `backend/seed.js`:

```javascript
const mongoose = require('mongoose');
const User = require('./models/User');
const Exam = require('./models/Exam');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    // Create admin user
    await User.create({
      name: 'Admin',
      email: 'admin@exam.com',
      password: 'admin123',
      role: 'admin'
    });
    
    // Create teacher
    await User.create({
      name: 'Teacher John',
      email: 'teacher@exam.com',
      password: 'teacher123',
      role: 'teacher'
    });
    
    // Create student
    await User.create({
      name: 'Student Priya',
      email: 'student@exam.com',
      password: 'student123',
      role: 'student'
    });
    
    console.log('Seed data created');
    process.exit();
  })
  .catch(err => console.error(err));
```

Run: `node seed.js`

## 📦 Deployment Guide

### Backend Deployment (Heroku/Railway/Render)

1. **Create Procfile**
```
web: node server.js
```

2. **Update environment variables on hosting platform**

3. **Deploy**
```bash
git push heroku main
# or use platform-specific CLI
```

### Frontend Deployment (Vercel/Netlify)

1. **Build the app**
```bash
npm run build
```

2. **Configure environment variables**
- Set `REACT_APP_API_URL` to your backend URL

3. **Deploy**
```bash
# Vercel
vercel

# Netlify
netlify deploy --prod
```

### MongoDB Atlas Setup

1. Create cluster on MongoDB Atlas
2. Whitelist IP addresses
3. Get connection string
4. Update MONGODB_URI in backend

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Password Hashing**: Using bcryptjs with salt rounds
3. **JWT Tokens**: Secure, expiring tokens
4. **CORS**: Configured for specific origins
5. **Input Validation**: Validate all user inputs
6. **SQL Injection**: Using Mongoose ORM prevents injection
7. **XSS Protection**: React auto-escapes output
8. **Rate Limiting**: Implement rate limiting for APIs

## 📝 Default Credentials

After seeding:
- **Admin**: admin@exam.com / admin123
- **Teacher**: teacher@exam.com / teacher123
- **Student**: student@exam.com / student123

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
```
Solution: Ensure MongoDB is running or check Atlas connection string
```

### CORS Error
```
Solution: Check CLIENT_URL in .env matches frontend URL
```

### Token Expired
```
Solution: Clear localStorage and login again
```

## 📞 Support

For issues or questions:
- Check documentation
- Review code comments
- Verify environment variables
- Check MongoDB connection

## 📄 License

MIT License - Free to use and modify

---

Built with ❤️ using MERN Stack
