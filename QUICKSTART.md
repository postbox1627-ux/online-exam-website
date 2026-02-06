# ⚡ Quick Start Guide - Online Exam Management System

Get up and running in 5 minutes!

## 🎯 Prerequisites Check

Before starting, verify you have:
- [ ] Node.js (v14+) - Run `node --version`
- [ ] MongoDB - Run `mongod --version`
- [ ] npm or yarn - Run `npm --version`

## 🚀 Installation Steps

### Step 1: Download & Extract
```bash
# If cloning from Git
git clone <repository-url>
cd online-exam-system

# If downloaded as ZIP
# Extract and navigate to the folder
```

### Step 2: Backend Setup (5 commands)
```bash
# Navigate to backend
cd backend

# Install dependencies (takes 1-2 min)
npm install

# Copy environment file
cp .env.example .env

# Start MongoDB (if not running)
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Start backend server
npm run dev
```

✅ Backend should now be running on `http://localhost:5000`

### Step 3: Frontend Setup (3 commands)
```bash
# Open NEW terminal
# Navigate to frontend folder
cd frontend

# Install dependencies (takes 1-2 min)
npm install

# Start frontend
npm start
```

✅ Frontend should open automatically at `http://localhost:3000`

## 🎨 First Time Setup

### Create Initial Admin Account

**Option 1: Via Registration**
1. Go to `http://localhost:3000/student/login`
2. Click "Register" (if available)
3. Fill in details
4. Login with credentials

**Option 2: Via Database Seed**
```bash
# In backend folder, create seed.js
cd backend
node seed.js
```

Default credentials:
- Admin: `admin@exam.com` / `admin123`
- Teacher: `teacher@exam.com` / `teacher123`
- Student: `student@exam.com` / `student123`

## 🧪 Test the System

### As Student:
1. Go to `http://localhost:3000/student/login`
2. Login with student credentials
3. View available exams
4. Take an exam
5. View results

### As Admin/Teacher:
1. Go to `http://localhost:3000/admin/login`
2. Login with admin credentials
3. Create a new exam
4. Add questions
5. View results

## 📝 Environment Configuration

Edit `backend/.env`:
```env
# Required - Keep defaults for local development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/exam_management
JWT_SECRET=change_this_secret_key_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

## 🎯 Quick Commands Reference

### Backend
```bash
cd backend
npm run dev     # Start development server
npm start       # Start production server
npm test        # Run tests (if available)
```

### Frontend
```bash
cd frontend
npm start       # Start development server
npm run build   # Create production build
npm test        # Run tests
```

## 🐛 Common Issues & Quick Fixes

### Issue 1: MongoDB Not Running
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Fix:**
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Issue 2: Port 5000 Already in Use
```bash
Error: listen EADDRINUSE :::5000
```
**Fix:** Change PORT in `.env` to 5001 or kill the process
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue 3: npm install Fails
```bash
Error: Cannot find module
```
**Fix:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue 4: React App Won't Start
```bash
Error: React Scripts not found
```
**Fix:**
```bash
cd frontend
npm install react-scripts --save
npm start
```

## 📱 Access URLs

Once everything is running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health
- **Student Login**: http://localhost:3000/student/login
- **Admin Login**: http://localhost:3000/admin/login

## 🔄 Development Workflow

1. **Make Changes** to code
2. **Backend**: Auto-restarts (nodemon)
3. **Frontend**: Auto-reloads in browser
4. **Test** your changes
5. **Commit** to version control

## 🎓 Next Steps

After successful setup:

1. ✅ Create sample exams
2. ✅ Add questions
3. ✅ Test exam taking process
4. ✅ Review monitoring features
5. ✅ Customize as needed

## 📚 Additional Resources

- Full Documentation: `docs/DOCUMENTATION.md`
- API Reference: `docs/API.md`
- Database Schema: `docs/SCHEMA.md`
- README: `README.md`

## 💡 Pro Tips

1. **Use MongoDB Compass** for visual database management
2. **Use Postman** to test API endpoints
3. **Enable browser DevTools** for debugging
4. **Check console logs** for errors
5. **Keep terminals open** to see live logs

## 🆘 Need Help?

1. Check the error message carefully
2. Review the documentation
3. Search for similar issues online
4. Check MongoDB and Node.js are running
5. Verify environment variables are correct

## ✅ Setup Checklist

- [ ] Node.js installed
- [ ] MongoDB installed and running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Environment file configured
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 3000)
- [ ] Can access login page
- [ ] Can create/login with account
- [ ] System is working!

---

**Setup Time:** ~5 minutes
**Difficulty:** Easy
**Support:** Check README.md for detailed help

🎉 **Congratulations!** Your Online Exam Management System is ready to use!
