# Query Management System

A comprehensive web-based query management system for educational institutions to handle facility maintenance requests, student complaints, and infrastructure issues.

## 🏗️ Project Structure

```
query-management-system/
├── loginapp/                    # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/example/loginapp/
│   │       ├── controller/      # REST API Controllers
│   │       ├── model/          # JPA Entities
│   │       ├── repository/     # Data Access Layer
│   │       ├── service/        # Business Logic
│   │       └── config/         # Configuration Classes
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml                 # Maven Configuration
│
├── login-frontend/             # React Frontend
│   ├── src/
│   │   ├── components/         # React Components
│   │   ├── contexts/          # React Context (Auth)
│   │   └── services/          # API Services
│   ├── public/
│   └── package.json           # NPM Configuration
│
└── README.md                  # This file
```

## ✨ Features

### 🔐 Authentication System
- **Google OAuth 2.0** integration for seamless login
- **Manual registration** with email/password
- **Role-based access** (Admin, Worker, Student)

### 📝 Query Management
- **Anonymous submission** for public accessibility
- **Image upload support** with camera capture
- **Category-based organization** (Electrical, Plumbing, etc.)
- **Priority levels** (Low, Medium, High, Urgent)
- **Venue selection** for location-specific issues

### 👷 Worker Management
- **Smart assignment** based on worker specialization
- **Worker dashboard** showing only assigned queries
- **Status tracking** (Pending → Assigned → In Progress → Resolved)
- **Completion evidence** with notes and photos

### 📊 Admin Dashboard
- **Complete oversight** of all queries
- **Worker assignment** with category filtering
- **Real-time statistics** and query metrics
- **Query deletion** and management capabilities

### 🎯 Key Functionalities
- **Real-time status updates**
- **Complete audit trail** in database
- **Professional UI** with Tailwind CSS
- **Responsive design** for all devices
- **File upload and storage**
- **Cross-origin resource sharing (CORS)**

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.x** - Java framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations
- **MySQL** - Primary database
- **Maven** - Dependency management

### Frontend
- **React 18** - JavaScript library
- **React Router** - Navigation
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library
- **Context API** - State management

## 🚀 Getting Started

### Prerequisites
- **Java 17+**
- **Node.js 16+**
- **MySQL 8.0+**
- **Maven 3.6+**

### Database Setup
1. Create MySQL database:
```sql
CREATE DATABASE login_db;
USE login_db;
```

2. The application will automatically create tables on first run.

### Backend Setup
1. Navigate to backend directory:
```bash
cd loginapp
```

2. Configure database in `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/login_db
spring.datasource.username=root
spring.datasource.password=your_password
```

3. Run the application:
```bash
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd login-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will start on `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/auth/google` - Google OAuth login

### Query Management
- `GET /api/queries` - Get all queries
- `POST /api/queries/anonymous` - Submit anonymous query
- `PUT /api/queries/{id}/assign` - Assign query to worker
- `PUT /api/queries/{id}/complete` - Mark query as complete
- `GET /api/queries/worker/{id}` - Get worker's assigned queries

### File Management
- `POST /api/files/upload` - Upload files
- `GET /uploads/**` - Serve uploaded files

## 👥 User Roles & Permissions

### Student/Anonymous
- Submit queries with attachments
- View public dashboard
- No login required for submission

### Worker
- View assigned queries
- Update query status
- Submit completion evidence
- Access worker dashboard

### Admin
- Complete system access
- Assign queries to workers
- Delete queries
- User management
- System analytics

## 🗄️ Database Schema

### Core Tables
- **users** - User authentication and profiles
- **queries** - Main query/complaint data
- **venues** - Location management
- **query_status_history** - Complete audit trail

### Key Relationships
- Users can raise queries (one-to-many)
- Workers can be assigned queries (one-to-many)
- Queries belong to venues (many-to-one)
- Status changes are tracked in history (one-to-many)

## 🔧 Configuration

### Environment Variables
- `MYSQL_HOST` - Database host
- `MYSQL_PORT` - Database port
- `MYSQL_DATABASE` - Database name
- `UPLOAD_DIR` - File upload directory

### File Upload
- Maximum file size: 10MB
- Supported formats: Images (JPG, PNG, GIF)
- Storage location: `uploads/` directory

## 📱 Screenshots & Demo

The system provides:
- Clean, professional interface
- Mobile-responsive design
- Intuitive navigation
- Real-time updates
- Visual status indicators

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**Query Management System** - Transforming institutional maintenance from reactive chaos to proactive, transparent operations.
