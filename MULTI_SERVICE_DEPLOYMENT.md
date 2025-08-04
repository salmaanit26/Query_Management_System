# Multi-Service Deployment Guide
**Architecture**: Vercel (Frontend) + Heroku (Backend) + Supabase (Database)

## 🎯 **Step-by-Step Deployment**

### **1. Setup Supabase Database**
1. **Create Account**: Go to https://supabase.com/ → Sign up with GitHub
2. **New Project**: Create project named `query-management-db`
3. **Get Connection**: Settings → Database → Copy connection string
4. **Format**: `postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres`

### **2. Deploy Backend to Heroku**
1. **Create Heroku Account**: https://heroku.com/
2. **Install Heroku CLI**: Download from heroku.com/cli
3. **Login**: `heroku login`
4. **Create App**: `heroku create your-app-name-backend`
5. **Set Database**: `heroku config:set DATABASE_URL="your-supabase-connection-string"`
6. **Deploy**: 
   ```bash
   git subtree push --prefix=loginapp heroku main
   ```

### **3. Deploy Frontend to Vercel**
1. **Update API URL**: Replace `your-heroku-app` with your actual Heroku app name
2. **Go to Vercel**: https://vercel.com/ → Import Git Repository
3. **Select Repo**: Choose `Query_Management_System`
4. **Environment Variables**:
   - `REACT_APP_API_URL`: `https://your-heroku-app.herokuapp.com/api`
5. **Deploy**: Vercel will build and deploy automatically

### **4. Update CORS Settings**
In your Heroku app, set:
```bash
heroku config:set CORS_ORIGINS="https://your-vercel-app.vercel.app"
```

## 🔗 **Final URLs Structure**
- **Frontend**: `https://query-management-system-salmaanit26.vercel.app`
- **Backend**: `https://your-app-backend.herokuapp.com`
- **Database**: Supabase (managed)

## ⚙️ **Environment Variables Needed**

### **Heroku (Backend)**:
```bash
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
CORS_ORIGINS=https://query-management-system-salmaanit26.vercel.app
SPRING_PROFILES_ACTIVE=heroku
```

### **Vercel (Frontend)**:
```bash
REACT_APP_API_URL=https://your-heroku-app.herokuapp.com/api
REACT_APP_GOOGLE_CLIENT_ID=382910553104-25j7msqipehpplqbeag5un4a2dhf609i.apps.googleusercontent.com
```

## 🚀 **Benefits of This Architecture**
- ✅ **Scalable**: Each service scales independently
- ✅ **Reliable**: Professional hosting with uptime guarantees
- ✅ **Cost-Effective**: Free tiers available for all services
- ✅ **Fast**: Global CDN for frontend, optimized database
- ✅ **Secure**: HTTPS everywhere, managed database security

## 🛠️ **Commands Summary**
```bash
# 1. Setup Heroku
heroku create your-backend-app
heroku config:set DATABASE_URL="your-supabase-url"

# 2. Deploy backend
git subtree push --prefix=loginapp heroku main

# 3. Update frontend environment
# Edit login-frontend/.env.production with Heroku URL

# 4. Deploy frontend via Vercel UI
# Import GitHub repo → Deploy
```
