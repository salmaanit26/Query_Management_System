# 🔐 Google OAuth Setup Guide

## 📋 **Steps to Configure Google Sign-In for Your Project**

### **Step 1: Create Google Cloud Project**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name it: "Query Management System"

### **Step 2: Enable Google Identity API**

1. Go to **APIs & Services** → **Library**
2. Search for **"Google Identity"**
3. Click **"Google Identity Services API"**
4. Click **"Enable"**

### **Step 3: Configure OAuth Consent Screen**

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **"External"** (for testing)
3. Fill required fields:
   - **App name**: Query Management System
   - **User support email**: Your email
   - **App logo**: Optional
   - **App domain**: `salmaanit26.github.io`
   - **Developer contact**: Your email
4. Click **"Save and Continue"**
5. Add test users (your email addresses)

### **Step 4: Create OAuth 2.0 Credentials**

1. Go to **APIs & Services** → **Credentials**
2. Click **"+ Create Credentials"** → **"OAuth 2.0 Client IDs"**
3. Select **"Web application"**
4. Name: "Query Management System Web Client"
5. **Authorized JavaScript origins**:
   ```
   https://salmaanit26.github.io
   http://localhost:3000
   http://localhost:3001
   ```
6. **Authorized redirect URIs**:
   ```
   https://salmaanit26.github.io/Query_Management_System
   http://localhost:3000
   http://localhost:3001
   ```
7. Click **"Create"**
8. **Copy the Client ID** (looks like: `123456789-xxxxxxxxxx.apps.googleusercontent.com`)

### **Step 5: Update Environment Variables**

1. Create `.env.production` file in `login-frontend/` folder:
   ```env
   REACT_APP_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE.apps.googleusercontent.com
   REACT_APP_API_BASE_URL=https://your-backend-url/api
   REACT_APP_ENVIRONMENT=production
   ```

2. For local development, create `.env.local`:
   ```env
   REACT_APP_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE.apps.googleusercontent.com
   REACT_APP_API_BASE_URL=http://localhost:8080/api
   REACT_APP_ENVIRONMENT=development
   ```

### **Step 6: Backend Google OAuth Handler**

Add this to your Spring Boot backend:

```java
@PostMapping("/google-login")
public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
    try {
        String idToken = request.get("credential");
        
        // Verify the Google ID token
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
            GoogleNetHttpTransport.newTrustedTransport(),
            GsonFactory.getDefaultInstance())
            .setAudience(Collections.singletonList(googleClientId))
            .build();
            
        GoogleIdToken.Payload payload = verifier.verify(idToken).getPayload();
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        
        // Create or find user in your database
        User user = userService.findOrCreateGoogleUser(email, name);
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "user", user,
            "token", jwtService.generateToken(user)
        ));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of(
            "success", false,
            "message", "Google authentication failed"
        ));
    }
}
```

### **Step 7: Test the Integration**

1. Build and deploy your frontend:
   ```bash
   npm run build
   npm run deploy
   ```

2. Visit: `https://salmaanit26.github.io/Query_Management_System`
3. You should now see the Google Sign-In button
4. Click it to test OAuth flow

### **🔧 Current Status**

- ✅ **Frontend**: Configured to conditionally show Google Sign-In
- ✅ **Error Handling**: Won't break if no Client ID is provided
- ⏳ **Need**: Your Google Client ID configuration
- ⏳ **Need**: Backend Google OAuth endpoint

### **📝 Quick Fix for Now**

If you want to proceed without Google OAuth for now:
- The app will work with regular email/password login
- Google Sign-In button will be hidden automatically
- No errors will occur

**Once you complete the Google Cloud setup, just update the environment variables and redeploy!** 🚀
