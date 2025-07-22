# Query Management System - Setup Guide

## 📋 Prerequisites Installation

### 1. Java 17+ Installation
- Download from [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://openjdk.org/)
- Verify installation: `java -version`

### 2. Node.js 16+ Installation
- Download from [Node.js Official Site](https://nodejs.org/)
- Verify installation: `node -v` and `npm -v`

### 3. MySQL 8.0+ Installation
- Download from [MySQL Official Site](https://dev.mysql.com/downloads/mysql/)
- Or use XAMPP/WAMP for local development

### 4. Maven 3.6+ Installation
- Download from [Apache Maven](https://maven.apache.org/download.cgi)
- Or use IDE with built-in Maven support

## 🗄️ Database Setup

### Create Database
```sql
CREATE DATABASE login_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE login_db;
```

### Default Admin User (Auto-created on first run)
```
Email: admin@college.edu
Password: password123
Role: ADMIN
```

### Sample Worker Users
```sql
INSERT INTO users (name, email, password, role, worker_type, phone) VALUES
('John Electrician', 'electrician@college.edu', 'password123', 'WORKER', 'ELECTRICIAN', '9876543210'),
('Mike Plumber', 'plumber@college.edu', 'password123', 'WORKER', 'PLUMBER', '9876543211'),
('Sarah Carpenter', 'carpenter@college.edu', 'password123', 'WORKER', 'CARPENTER', '9876543212');
```

## ⚙️ Configuration

### Backend Configuration (`loginapp/src/main/resources/application.properties`)
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/login_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
app.upload.dir=uploads/

# CORS Configuration
app.cors.allowed-origins=http://localhost:3000,http://localhost:3001
```

## 🚀 Running the Application

### Start Backend (Terminal 1)
```bash
cd loginapp
mvn clean install
mvn spring-boot:run
```
Backend will run on: `http://localhost:8080`

### Start Frontend (Terminal 2)
```bash
cd login-frontend
npm install
npm start
```
Frontend will run on: `http://localhost:3000`

## 🔐 Access Credentials

### Admin Access
- **URL**: `http://localhost:3000`
- **Email**: `admin@college.edu`
- **Password**: `password123`
- **Features**: Full system access, assign queries, manage users

### Worker Access
- **Email**: `electrician@college.edu`
- **Password**: `password123`
- **Features**: View assigned queries, update status, mark complete

### Anonymous Access
- **URL**: `http://localhost:3000/new-query`
- **Features**: Submit queries without login

## 📁 Directory Structure After Setup
```
query-management-system/
├── loginapp/                 # Backend (Port 8080)
├── login-frontend/          # Frontend (Port 3000)
├── uploads/                 # File storage (auto-created)
├── .gitignore
├── README.md
└── SETUP.md
```

## 🔧 Troubleshooting

### Database Connection Issues
1. Ensure MySQL is running
2. Check database credentials in `application.properties`
3. Verify database `login_db` exists

### Port Already in Use
- **Backend Port 8080**: Kill Java processes or change port in `application.properties`
- **Frontend Port 3000**: Choose different port when prompted by npm

### File Upload Issues
1. Check `uploads/` directory permissions
2. Verify file size limits in configuration
3. Ensure sufficient disk space

### CORS Issues
- Verify CORS origins in `application.properties`
- Check frontend URL matches allowed origins

## 📊 Testing the System

### 1. Anonymous Query Submission
- Visit: `http://localhost:3000/new-query`
- Submit a query with image attachment
- Check if it appears in dashboard

### 2. Admin Workflow
- Login as admin
- View all queries in dashboard
- Assign query to worker
- Monitor status changes

### 3. Worker Workflow
- Login as worker
- Navigate to "Worker Dashboard"
- Start working on assigned query
- Mark complete with notes/image

## 🌐 Production Deployment Notes

### Environment Variables
```bash
export MYSQL_HOST=production-db-host
export MYSQL_PORT=3306
export MYSQL_DATABASE=login_db
export MYSQL_USERNAME=db_user
export MYSQL_PASSWORD=secure_password
```

### Build for Production
```bash
# Frontend
cd login-frontend
npm run build

# Backend
cd loginapp
mvn clean package -Dmaven.test.skip=true
```

### Security Considerations
- Change default passwords
- Use environment variables for sensitive data
- Enable HTTPS in production
- Configure proper CORS origins
- Set up database backups

---

**Ready to use!** 🎉 The system is now properly configured and ready for development or production use.
