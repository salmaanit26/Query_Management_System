# 🚀 **Deploy to Railway - Perfect for Spring Boot**

Railway is the easiest platform for Java Spring Boot deployment!

## **Why Railway is Perfect:**
- ✅ **No CLI needed** - all web-based
- ✅ **Direct GitHub integration**
- ✅ **Automatic Java detection**
- ✅ **Free tier: $5/month credit**
- ✅ **Super simple setup**

## **Step 1: Create Railway Account**
1. Go to: https://railway.app
2. **Sign up with GitHub** (easiest)
3. **Authorize Railway** to access your repos

## **Step 2: Deploy Your Backend**
1. **Click "New Project"**
2. **Select "Deploy from GitHub repo"**
3. **Choose**: `salmaanit26/Query_Management_System`
4. **Railway will auto-detect** it's a Java project!

## **Step 3: Configure for Backend Only**
1. **In Railway dashboard** → Click your project
2. **Settings** → **Environment Variables**
3. **Add these variables**:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://postgres:[salmaaN_20]@db.juulbplyppgklawlxwjd.supabase.co:5432/postgres` |
| `SPRING_PROFILES_ACTIVE` | `railway` |
| `PORT` | `8080` |

## **Step 4: Set Root Directory**
1. **Settings** → **Build & Deploy**
2. **Root Directory**: `loginapp`
3. **Build Command**: `./mvnw clean package -DskipTests`
4. **Start Command**: `java -jar target/*.jar`

## **Step 5: Deploy**
1. **Click "Deploy"** 
2. **Wait 3-5 minutes** for build
3. **Get your URL**: `https://your-app-name.railway.app`

## **Step 6: Test**
Visit: `https://your-app-name.railway.app/api/health`

---

## 🎯 **Railway vs PythonAnywhere**

| Feature | Railway | PythonAnywhere |
|---------|---------|----------------|
| Java Support | ✅ Perfect | ❌ Python only |
| GitHub Integration | ✅ Automatic | ❌ Manual |
| Free Tier | ✅ $5/month credit | ✅ Limited |
| Setup Time | ⚡ 5 minutes | 🐌 30+ minutes |

**Recommendation**: Use Railway for your Java backend!
