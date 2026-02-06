# 🎓 Online Exam Management System

A comprehensive full-stack web application for conducting online examinations with real-time monitoring and anti-cheating mechanisms.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## 📸 Screenshots

Based on the provided UI designs, this system includes:
- **Student Module**: Dashboard, Exam Interface, Results
- **System Module**: Real-time Monitoring, Cheating Detection
- **Admin Module**: Dashboard, Exam Management, User Management

## ✨ Features

### 🎯 Student Module
- ✅ Secure authentication (Login/Register)
- ✅ View available exams
- ✅ Take exams with countdown timer
- ✅ MCQ question interface
- ✅ Question navigation (Next/Previous)
- ✅ Auto-submit on timer expiry
- ✅ Instant result display
- ✅ View detailed answers
- ✅ Result history

### 🖥️ System Monitoring Module
- ✅ Live student camera feed
- ✅ Real-time cheating detection:
  - Face not visible alert
  - Multiple faces detection
  - Tab switching detection
  - Window blur detection
  - Fullscreen exit detection
- ✅ Warning system
- ✅ Activity logging
- ✅ Exam timer control

### 👨‍💼 Admin/Teacher Module
- ✅ Comprehensive dashboard
- ✅ Exam management (Create/Edit/Delete)
- ✅ Question bank management
- ✅ Bulk question import
- ✅ Student management
- ✅ Results viewing & analysis
- ✅ PDF report generation
- ✅ Excel export functionality
- ✅ User role management

## 🛠️ Tech Stack

### Backend
```
Node.js v14+
Express.js v4.18+
MongoDB v5.0+
Mongoose v7.0+
JWT Authentication
Socket.IO v4.6+
bcryptjs
```

### Frontend
```
React 18.2+
React Router v6
Axios
Socket.IO Client
Recharts (for analytics)
jsPDF (for PDF generation)
React Icons
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn**
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/online-exam-system.git
cd online-exam-system
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Install dependencies
```bash
npm install
```

#### Create environment file
```bash
cp .env.example .env
```

#### Configure .env file
Open `.env` and update the following:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/exam_management

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:3000

# File Upload (optional)
MAX_FILE_SIZE=5242880
```

#### Start MongoDB
```bash
# On Windows (if installed as service)
net start MongoDB

# On macOS
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

#### Run the backend server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

Backend server will run on `http://localhost:5000`

### 3. Frontend Setup

#### Open new terminal and navigate to frontend directory
```bash
cd frontend
```

#### Install dependencies
```bash
npm install
```

#### Start the development server
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. Make sure MongoDB is running
2. The database will be created automatically when you start the backend

### Option 2: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/exam_management
```

### Seed Database (Optional)

Create initial admin, teacher, and student accounts:

```bash
cd backend
node seed.js
```

**Default Credentials:**
```
Admin:
Email: admin@exam.com
Password: admin123

Teacher:
Email: teacher@exam.com
Password: teacher123

Student:
Email: student@exam.com
Password: student123
```

## 📱 Usage

### For Students:
1. Navigate to `http://localhost:3000/student/login`
2. Login or register
3. View available exams
4. Click "Start Exam"
5. Answer questions
6. Submit exam
7. View results

### For Teachers/Admin:
1. Navigate to `http://localhost:3000/admin/login`
2. Login with admin/teacher credentials
3. Access dashboard
4. Create/manage exams
5. Add questions
6. Monitor students
7. View and export results

## 📂 Project Structure

```
online-exam-system/
│
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Exam.js              # Exam schema
│   │   ├── Question.js          # Question schema
│   │   ├── Result.js            # Result schema
│   │   └── CheatingLog.js       # Cheating log schema
│   │
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── exams.js             # Exam CRUD routes
│   │   ├── questions.js         # Question routes
│   │   ├── results.js           # Result routes
│   │   ├── monitoring.js        # Monitoring routes
│   │   └── users.js             # User management routes
│   │
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   │
│   ├── server.js                # Main server file
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Timer.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   └── ...
│   │   │
│   │   ├── pages/
│   │   │   ├── student/         # Student pages
│   │   │   ├── admin/           # Admin pages
│   │   │   └── monitoring/      # Monitoring pages
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js   # Auth state management
│   │   │
│   │   ├── utils/
│   │   │   ├── api.js           # Axios instance
│   │   │   └── socket.js        # Socket.IO config
│   │   │
│   │   ├── styles/
│   │   │   └── App.css          # Global styles
│   │   │
│   │   ├── App.js               # Main component
│   │   └── index.js             # Entry point
│   │
│   └── package.json
│
└── docs/
    ├── DOCUMENTATION.md          # Complete documentation
    ├── API.md                    # API reference
    └── DEPLOYMENT.md             # Deployment guide
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
GET    /api/auth/me              - Get current user
PUT    /api/auth/update-profile  - Update profile
PUT    /api/auth/change-password - Change password
```

### Exams
```
GET    /api/exams                - Get all exams
GET    /api/exams/:id            - Get single exam
POST   /api/exams                - Create exam (Teacher/Admin)
PUT    /api/exams/:id            - Update exam (Teacher/Admin)
DELETE /api/exams/:id            - Delete exam (Teacher/Admin)
GET    /api/exams/:id/questions  - Get exam questions
```

### Questions
```
GET    /api/questions/exam/:examId  - Get all questions for exam
POST   /api/questions               - Create question
POST   /api/questions/bulk          - Bulk create questions
PUT    /api/questions/:id           - Update question
DELETE /api/questions/:id           - Delete question
```

### Results
```
POST   /api/results/submit         - Submit exam
GET    /api/results/student/:id    - Get student results
GET    /api/results/exam/:examId   - Get exam results
GET    /api/results/:id            - Get result details
GET    /api/results/export/:examId - Export results
```

### Monitoring
```
POST   /api/monitoring/alert        - Log cheating alert
GET    /api/monitoring/exam/:examId - Get exam alerts
POST   /api/monitoring/warning/:id  - Send warning
PUT    /api/monitoring/resolve/:id  - Resolve alert
```

### Users (Admin only)
```
GET    /api/users           - Get all users
GET    /api/users/:id       - Get user
POST   /api/users           - Create user
PUT    /api/users/:id       - Update user
DELETE /api/users/:id       - Delete user
PUT    /api/users/:id/reset-password - Reset password
```

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected routes
- ✅ Role-based access control
- ✅ Input validation
- ✅ CORS configuration
- ✅ XSS protection
- ✅ MongoDB injection prevention

## 🎨 UI/UX Features

- ✅ Responsive design (mobile-friendly)
- ✅ Modern, clean interface
- ✅ Intuitive navigation
- ✅ Real-time updates
- ✅ Loading states
- ✅ Error handling
- ✅ Success notifications

## 📊 Monitoring & Analytics

- Real-time exam monitoring
- Cheating detection with alerts
- Student activity logging
- Result analytics
- Performance metrics
- Exportable reports

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running. Start it with:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process or change PORT in .env

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Check CLIENT_URL in backend .env matches frontend URL

### JWT Token Expired
**Solution:** Clear localStorage and login again
```javascript
localStorage.clear();
```

## 📦 Deployment

### Backend Deployment (Heroku)
```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongolab

# Set environment variables
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
REACT_APP_API_URL=your_backend_url
```

### Frontend Deployment (Netlify)
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

- React documentation
- Express.js documentation
- MongoDB documentation
- Socket.IO documentation
- All contributors

## 📧 Contact

For support or queries:
- Create an issue on GitHub
- Email: support@examapp.com

## 🎯 Roadmap

- [ ] Add support for essay-type questions
- [ ] Implement AI-based proctoring
- [ ] Add video recording during exams
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Integration with LMS platforms

---

**Made with ❤️ using MERN Stack**

*Remember to star ⭐ this repository if you found it helpful!*
