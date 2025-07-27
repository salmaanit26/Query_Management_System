# 🚀 Query Management System - GitHub Codespaces

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/salmaanit26/Query_Management_System)

## 🌟 Quick Start with GitHub Codespaces

### 🔥 One-Click Development Environment

1. **Click the "Open in GitHub Codespaces" badge above**
2. **Wait for the environment to set up (2-3 minutes)**
3. **Run the application:**
   ```bash
   ./start-all.sh
   ```

### 🎯 What's Included

- ✅ **Java 21** with Maven
- ✅ **Node.js 18** for React
- ✅ **MySQL 8.0** Database
- ✅ **VS Code Extensions** (Java, Spring Boot, React)
- ✅ **Automatic Port Forwarding**
- ✅ **Sample Data** Pre-loaded

### 🌐 URLs (Auto-forwarded)

- **Frontend**: `https://your-codespace-name-3000.preview.app.github.dev`
- **Backend**: `https://your-codespace-name-8080.preview.app.github.dev`

### 📋 Manual Setup (if needed)

```bash
# Start database
docker-compose up -d mysql

# Start backend
cd loginapp
./mvnw spring-boot:run &

# Start frontend
cd login-frontend
npm start
```

### 🔑 Sample Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | password123 |
| Student | student1 | password123 |
| Worker | worker1 | password123 |

### 🛠 Development Commands

```bash
# Start everything
./start-all.sh

# Start only frontend
./start-frontend.sh

# Start only backend
./start-backend.sh

# Build for production
cd login-frontend && npm run build

# Run backend tests
cd loginapp && ./mvnw test
```

### 📊 Database Access

- **Host**: localhost:3306
- **Database**: loginapp
- **Username**: loginuser
- **Password**: loginpass

### 🎨 Features

- 🔐 **Role-based Authentication** (Admin/Student/Worker)
- 🌙 **Dark/Light Theme** Toggle
- 📱 **Responsive Design** (Mobile-friendly)
- 🏢 **Venue Management** (Admin only)
- 👥 **User Management** (View only)
- 📋 **Query System** (Submit & Track)
- 🔄 **Real-time Updates**

### 🚀 Production Deployment

- **Frontend**: Auto-deployed to [GitHub Pages](https://salmaanit26.github.io/Query_Management_System)
- **Backend**: Available in Codespaces with public URL
- **Database**: MySQL in Docker container

### 📚 Tech Stack

- **Frontend**: React 18, Tailwind CSS, React Router
- **Backend**: Spring Boot 3, Spring Security, JPA/Hibernate
- **Database**: MySQL 8.0
- **Deployment**: GitHub Pages + Codespaces

---

**🎉 Happy Coding!** Your Query Management System is ready to use in the cloud! 🌟
