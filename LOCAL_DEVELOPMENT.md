# 🏠 **LOCAL DEVELOPMENT SETUP** - Query Management System

## 💻 **Run Your Application Locally**

Your Query Management System is ready to run on your local computer with SQLite database (no internet hosting needed).

### **🚀 Quick Start (5 minutes)**

#### **Step 1: Start Backend (Spring Boot)**
```bash
cd loginapp
./mvnw spring-boot:run
```
- **Backend runs on**: http://localhost:8080
- **Database**: SQLite (local file - no setup needed)

#### **Step 2: Start Frontend (React)**
```bash
cd login-frontend
npm start
```
- **Frontend runs on**: http://localhost:3000
- **Automatically connects** to backend on localhost:8080

### **🎯 Your Local URLs:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Health Check**: http://localhost:8080/api/health

### **👤 Default Login Credentials:**
- **Admin**: admin@college.edu / password
- **Student**: student@college.edu / password  
- **Worker**: john.electrician@company.com / password

### **📁 Database Location:**
- **SQLite file**: `loginapp/database.db`
- **Automatic setup** - no configuration needed
- **All data stored locally** on your computer

---

## 🔧 **Development Commands**

### **Backend Commands:**
```bash
cd loginapp

# Run the application
./mvnw spring-boot:run

# Run tests
./mvnw test

# Package for production
./mvnw clean package
```

### **Frontend Commands:**
```bash
cd login-frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

---

## 🎨 **Features Available Locally:**

✅ **User Management** - Admin, Students, Workers
✅ **Query Management** - Create, assign, resolve queries  
✅ **Venue Management** - Manage locations and facilities
✅ **File Uploads** - Images for queries and profiles
✅ **Dashboard** - Different views for each user type
✅ **Authentication** - Login/logout functionality

---

## 🗃️ **Local Database:**

- **Type**: SQLite (file-based)
- **Location**: `loginapp/database.db`
- **Setup**: Automatic on first run
- **Sample Data**: Pre-loaded with venues and users

---

**🎉 Your application runs completely offline - no internet required!**
**Perfect for development, testing, and local use.**
