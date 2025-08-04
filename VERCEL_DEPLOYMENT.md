# Vercel Deployment Guide for Query Management System

## Prerequisites
1. GitHub account with your repository
2. Vercel account (free)

## Project Architecture
- **Frontend**: React.js application (login-frontend/)
- **Backend**: Spring Boot API (loginapp/)
- **Database**: SQLite (file-based, no external database needed)

## Step 1: Deploy to Vercel

### 1.1 Create Vercel Account
1. Go to https://vercel.com/
2. Sign up with GitHub
3. Import your repository: `Query_Management_System`

### 1.2 Configure Environment Variables in Vercel
In your Vercel project dashboard, go to Settings > Environment Variables and add:

**For all environments (Development, Preview, Production):**
```
SPRING_PROFILES_ACTIVE=vercel
```

**For frontend (optional):**
```
REACT_APP_GOOGLE_CLIENT_ID=382910553104-25j7msqipehpplqbeag5un4a2dhf609i.apps.googleusercontent.com
GENERATE_SOURCEMAP=false
```

### 1.3 Configure Build Settings
In Vercel project settings:
- **Framework Preset:** Other
- **Root Directory:** ./
- **Build Command:** `./build-frontend.sh`
- **Output Directory:** `login-frontend/build`

## Step 2: Update Google OAuth Settings (Optional)

1. Go to Google Cloud Console
2. In OAuth 2.0 Client IDs, add your Vercel domains:
   - `https://your-project-name.vercel.app`
   - `https://your-project-name-git-main-yourusername.vercel.app`

## Step 3: Deploy

1. Push your changes to GitHub
2. Vercel will automatically deploy
3. Check deployment logs for any issues

## Step 4: Initialize Database

After successful deployment:
1. Your Spring Boot app will auto-create SQLite database
2. Sample data (venues and workers) will be initialized automatically
3. You can access the app and start using it immediately

## Features Available in Production:
- ✅ **User Management**: Admin, Worker, Student roles
- ✅ **Query Management**: Create, assign, track maintenance queries
- ✅ **File Uploads**: Image attachments for queries
- ✅ **Venue Management**: Manage locations and facilities
- ✅ **Worker Assignment**: Assign tasks based on worker specialization
- ✅ **Status Tracking**: Track query progress from creation to completion
- ✅ **Dashboard**: Real-time overview of queries and statistics

## Troubleshooting

### Common Issues:
1. **Build Failures**: Check Node.js version compatibility
2. **API Errors**: Verify Spring Boot application is starting correctly
3. **File Uploads**: Check /tmp directory permissions

### Useful Commands:
```bash
# Test locally with Vercel environment
vercel dev

# Check deployment logs
vercel logs

# Set environment variables via CLI
vercel env add
```

## Project Structure for Vercel:
```
Query_Management_System/
├── vercel.json                 # Vercel configuration
├── build-frontend.sh          # Frontend build script
├── login-frontend/            # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
└── loginapp/                  # Spring Boot backend
    ├── src/main/java/
    ├── src/main/resources/
    └── pom.xml
```

## Database Schema
The SQLite database will automatically create these tables:
- `users` - User accounts (admin, workers, students)
- `venues` - Locations and facilities
- `queries` - Maintenance requests
- `query_status_history` - Status change tracking

## Sample Data
The application will initialize with:
- 8 sample venues (labs, classrooms, library, offices)
- 8 sample workers (electricians, plumbers, carpenters, etc.)
- Ready-to-use admin and worker accounts
├── loginapp/                  # Spring Boot backend
└── README.md
```

## Final URLs:
- **Frontend:** https://your-project-name.vercel.app
- **Backend API:** https://your-project-name.vercel.app/api
- **Admin Dashboard:** https://your-project-name.vercel.app/dashboard
