# School Mobile App - Setup Guide

## ✅ Project Created Successfully!

Your React Native mobile app has been created with Expo SDK 56.

### 📱 Project Structure

```
school-mobile/
├── src/
│   ├── api/
│   │   └── api.js              (API configuration)
│   ├── screens/
│   │   ├── LoginScreen.js       (Login/Signup UI)
│   │   └── DashboardScreen.js   (Role-specific dashboards)
│   └── contexts/
│       └── AuthContext.js       (Authentication state management)
├── app.json                     (Expo configuration)
├── package.json                 (Dependencies)
└── expo-router setup            (File-based routing)
```

---

## 🚀 Quick Start

### Step 1: Configure API Connection

**IMPORTANT:** You need to update the API server IP address.

1. Open: `school-mobile/src/api/api.js`
2. Find this line:
   ```javascript
   const PC_IP = '192.168.1.100'; // Change this to your PC IP
   ```
3. Replace `192.168.1.100` with your computer's IPv4 address

#### How to find your PC IP:

**Windows Terminal:**
```powershell
ipconfig
```

Look for "IPv4 Address" (usually looks like `192.168.x.x`)

### Step 2: Start the Backend Server

```bash
cd "d:\school app"
npm start
```

The backend should be running on `http://localhost:5000`

### Step 3: Start the Mobile App

```bash
cd "d:\school app\school-mobile"
npm start
```

You'll see:
```
► Press a ─ open Android
► Press i ─ open iOS  
► Press w ─ open web
► Press j ─ open Debugger
```

### Step 4: Run on Phone or Simulator

#### Option A: Physical Phone (Recommended)
1. Install **Expo Go** from App Store or Play Store
2. Scan the QR code shown in terminal
3. App opens on your phone

#### Option B: Web Browser
Press `w` in terminal to open web version

#### Option C: Emulator
- Press `a` for Android emulator (requires Android Studio)
- Press `i` for iOS simulator (requires Mac)

---

## 🔐 Test Accounts

Use these credentials to login:

### Student Account
```
Email:    alice.student@school.com
Password: StudentPass123!
Role:     Student
```
**Features:** View personal attendance and marks

### Teacher Account
```
Email:    bob.teacher@school.com
Password: TeacherPass123!
Role:     Teacher
```
**Features:** View class overview and student statistics

### Admin Account
```
Email:    charlie.admin@school.com
Password: AdminPass123!
Role:     Admin
```
**Features:** View system-wide statistics and all data

---

## 📋 Features Implemented

### ✅ Authentication
- Login with email and password
- Signup with role selection
- JWT token management
- Token persistence (AsyncStorage)
- Auto-login on app restart

### ✅ Role-Based Dashboards
- **Student Dashboard:** Personal attendance & marks
- **Teacher Dashboard:** Class overview & student stats
- **Admin Dashboard:** System statistics & user management

### ✅ API Integration
- Axios for HTTP requests
- Bearer token authentication
- Error handling
- Loading states

---

## 🔌 API Endpoints Used

```
POST   /login                   - User login
POST   /signup                  - User registration
GET    /api/student/dashboard   - Student dashboard
GET    /api/teacher/dashboard   - Teacher dashboard
GET    /api/admin/dashboard     - Admin dashboard
GET    /api/students            - List all students
GET    /api/marks               - Marks records
GET    /api/attendance          - Attendance records
```

---

## 📱 Mobile App Files

### `src/api/api.js`
- Axios instance configuration
- PC IP address (needs to be updated)
- Bearer token setup
- Request/response interceptors

### `src/contexts/AuthContext.js`
- Authentication state management
- Login/Signup/Logout functions
- Token persistence
- Error handling

### `src/screens/LoginScreen.js`
- Login form with email and password
- Signup form with role selection
- Test credentials display
- Loading and error states

### `src/screens/DashboardScreen.js`
- Role-specific dashboard views
- Student: Attendance & Marks summary
- Teacher: Class overview & Student stats
- Admin: System overview & User statistics
- Pull-to-refresh functionality
- Logout button

---

## ⚠️ Important Configuration Steps

### 1. Update API Server IP

**File:** `src/api/api.js`

```javascript
// BEFORE (incorrect)
const PC_IP = '192.168.1.100';

// AFTER (your actual IP)
const PC_IP = '192.168.1.50'; // Replace with your IP
```

**Why?** Mobile devices cannot use `localhost:5000`. They need the actual network IP.

### 2. Ensure Backend is Running

```bash
cd "d:\school app"
npm start
```

Expected output:
```
🧠 Mock DB initialized
🚀 Server running on port 5000
```

### 3. Mobile App Must Have Network Access

- Phone must be on same WiFi as your computer
- Or use emulator with proper network configuration
- Or use port forwarding if on different networks

---

## 🧪 Testing the Mobile App

### Test Flow:
1. ✅ Start backend server (port 5000)
2. ✅ Update API IP in mobile app config
3. ✅ Start mobile app (`npm start`)
4. ✅ Open in Expo Go or web browser
5. ✅ Login with test credentials
6. ✅ View role-specific dashboard
7. ✅ Test logout
8. ✅ Try other test accounts

### Expected Results:
- ✅ Login succeeds with correct credentials
- ✅ Dashboard loads after login
- ✅ Different content shown for each role
- ✅ Can logout and return to login screen
- ✅ Auto-login works after restart
- ✅ Refresh pulls latest data

---

## 🐛 Troubleshooting

### Issue: "Connection refused" or "Network error"

**Solution:**
1. Update PC_IP in `src/api/api.js`
2. Verify backend is running on port 5000
3. Check phone is on same WiFi
4. Check firewall isn't blocking port 5000

### Issue: "Invalid token" after login

**Solution:**
1. Clear app data in Expo Go
2. Logout and login again
3. Check token is being saved to AsyncStorage

### Issue: "Module not found"

**Solution:**
```bash
cd school-mobile
npm install
```

### Issue: App crashes on startup

**Solution:**
1. Check console for error messages
2. Verify all imports are correct
3. Restart Expo CLI: `npm start --clear`

---

## 📦 Dependencies Installed

```json
{
  "axios": "HTTP client for API calls",
  "expo": "React Native runtime",
  "expo-router": "File-based navigation",
  "react": "UI framework",
  "react-native": "Mobile framework",
  "react-native-screens": "Navigation optimization"
}
```

---

## 🔄 File Structure

```
school-mobile/
├── src/
│   ├── api/
│   │   └── api.js
│   ├── contexts/
│   │   └── AuthContext.js
│   └── screens/
│       ├── LoginScreen.js
│       └── DashboardScreen.js
├── assets/
├── app.json
├── package.json
├── package-lock.json
└── README.md
```

---

## 🎯 Next Steps

1. ✅ Update PC_IP configuration
2. ✅ Start backend server
3. ✅ Start mobile app
4. ✅ Test login with credentials
5. ✅ View dashboards by role
6. ✅ Test logout

---

## 💡 Additional Information

- **Framework:** React Native with Expo
- **Navigation:** Expo Router (file-based)
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Storage:** AsyncStorage
- **Authentication:** JWT Bearer tokens

---

## 📞 Support

For issues:
1. Check the troubleshooting section above
2. Review console logs in Expo Go
3. Check backend server logs
4. Verify network connectivity
5. Try clearing app cache

---

**Status:** ✅ Ready for Development
**Last Updated:** June 3, 2026
