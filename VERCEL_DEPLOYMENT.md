# Vercel Deployment Guide for Query Management System

## Prerequisites
1. GitHub account with your repository
2. Vercel account (free)
3. PlanetScale account (free MySQL hosting)

## Step 1: Set up PlanetScale Database

### 1.1 Create PlanetScale Account
1. Go to https://planetscale.com/
2. Sign up with GitHub
3. Create a new database named `query-management-db`

### 1.2 Get Database Connection Details
1. In PlanetScale dashboard, go to your database
2. Click "Connect" 
3. Select "General" connection
4. Copy the connection details:
   - Host
   - Username  
   - Password
   - Database name

## Step 2: Deploy to Vercel

### 2.1 Create Vercel Account
1. Go to https://vercel.com/
2. Sign up with GitHub
3. Import your repository: `Query_Management_System`

### 2.2 Configure Environment Variables in Vercel
In your Vercel project dashboard, go to Settings > Environment Variables and add:

**For all environments (Development, Preview, Production):**
```
MYSQL_URL=mysql://username:password@host/database?sslaccept=strict
MYSQL_USER=your_planetscale_username
MYSQL_PASSWORD=your_planetscale_password
MYSQL_DATABASE=query-management-db
SPRING_PROFILES_ACTIVE=vercel
```

**For frontend:**
```
REACT_APP_API_URL=https://your-project-name.vercel.app/api
REACT_APP_GOOGLE_CLIENT_ID=382910553104-25j7msqipehpplqbeag5un4a2dhf609i.apps.googleusercontent.com
```

### 2.3 Configure Build Settings
In Vercel project settings:
- **Framework Preset:** Other
- **Root Directory:** ./
- **Build Command:** `./build-frontend.sh`
- **Output Directory:** `login-frontend/build`

## Step 3: Update Google OAuth Settings

1. Go to Google Cloud Console
2. In OAuth 2.0 Client IDs, add your Vercel domains:
   - `https://your-project-name.vercel.app`
   - `https://your-project-name-git-main-yourusername.vercel.app`

## Step 4: Deploy

1. Push your changes to GitHub
2. Vercel will automatically deploy
3. Check deployment logs for any issues

## Step 5: Initialize Database

After successful deployment:
1. Your Spring Boot app will auto-create tables
2. You can add initial data through the API or admin interface

## Troubleshooting

### Common Issues:
1. **Database Connection:** Check PlanetScale connection string
2. **CORS Errors:** Verify allowed origins in Spring Boot config
3. **Build Failures:** Check Node.js version compatibility

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
├── loginapp/                  # Spring Boot backend
└── README.md
```

## Final URLs:
- **Frontend:** https://your-project-name.vercel.app
- **Backend API:** https://your-project-name.vercel.app/api
- **Admin Dashboard:** https://your-project-name.vercel.app/dashboard
