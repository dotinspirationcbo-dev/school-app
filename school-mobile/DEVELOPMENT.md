# React Native Mobile App Development Guide

## 📱 Project Overview

**School Mobile App** is a React Native application built with Expo that connects to the backend API to provide role-based access to school management features.

### Key Features:
- ✅ User Authentication (Login/Signup)
- ✅ Role-Based Dashboards (Student/Teacher/Admin)
- ✅ JWT Token Management
- ✅ Token Persistence
- ✅ Real-time Data Fetching
- ✅ Pull-to-Refresh
- ✅ Cross-Platform (iOS/Android/Web)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│         Mobile App (React Native)       │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   LoginScreen / DashboardScreen  │  │
│  └────────────────┬─────────────────┘  │
│                   │                    │
│  ┌────────────────▼─────────────────┐  │
│  │      AuthContext (State Mgmt)    │  │
│  └────────────────┬─────────────────┘  │
│                   │                    │
│  ┌────────────────▼─────────────────┐  │
│  │    axios API Client (api.js)     │  │
│  └────────────────┬─────────────────┘  │
└────────────────────┼────────────────────┘
                     │ HTTP/Bearer Token
┌────────────────────▼────────────────────┐
│      Backend API (Express.js)           │
│                                         │
│  - Authentication (JWT)                │
│  - Dashboard endpoints                 │
│  - Data management                     │
└─────────────────────────────────────────┘
```

---

## 📂 Project Structure

### Core Directories

```
school-mobile/
├── src/
│   ├── api/
│   │   └── api.js                # API configuration & axios instance
│   ├── contexts/
│   │   └── AuthContext.js         # Authentication state & functions
│   └── screens/
│       ├── LoginScreen.js         # Login & signup UI
│       └── DashboardScreen.js     # Role-specific dashboards
├── assets/                        # Images, fonts, etc.
├── app.json                       # Expo configuration
├── package.json                   # Dependencies
├── SETUP_GUIDE.md                # Quick start guide
└── DEVELOPMENT.md                # This file
```

---

## 🔑 Key Components

### 1. API Configuration (`src/api/api.js`)

```javascript
import axios from 'axios';

const PC_IP = '192.168.1.100'; // ⚠️ UPDATE WITH YOUR IP

const api = axios.create({
  baseURL: `http://${PC_IP}:5000`,
  timeout: 10000,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export default api;
```

**Key Points:**
- Axios instance with base URL configuration
- Bearer token injection into headers
- Timeout configuration (10 seconds)
- Content-Type set to JSON

### 2. Auth Context (`src/contexts/AuthContext.js`)

Manages:
- ✅ User state
- ✅ Token management
- ✅ Loading/error states
- ✅ Login/Signup/Logout functions
- ✅ Token persistence

**Functions:**
```javascript
login(email, password)       // Authenticate user
signup(fullName, email, password, role)  // Create new user
logout()                     // Clear auth data
```

### 3. Login Screen (`src/screens/LoginScreen.js`)

**Features:**
- Email and password inputs
- Signup form with role selection
- Test credentials display
- Error message display
- Loading indicator
- Form validation

### 4. Dashboard Screen (`src/screens/DashboardScreen.js`)

**Displays:**
- Student: Attendance & Marks
- Teacher: Class Overview & Stats
- Admin: System Statistics
- Pull-to-refresh
- Logout button

---

## 🚀 Getting Started

### Prerequisites
- Node.js and npm
- Expo CLI
- Phone with Expo Go app (or emulator)
- Backend server running on port 5000

### Installation

```bash
# Navigate to mobile app
cd "d:\school app\school-mobile"

# Install dependencies (if not already done)
npm install

# Start the app
npm start
```

### Configuration

**CRITICAL STEP:** Update PC IP address

1. Open `src/api/api.js`
2. Find: `const PC_IP = '192.168.1.100';`
3. Replace with your PC's IPv4 address

**To find your IP:**
```powershell
ipconfig
```

Look for "IPv4 Address: 192.168.x.x"

---

## 🔐 Authentication Flow

### Login Process

```
1. User enters email + password
2. Press Login button
3. API request sent: POST /login
4. Backend validates credentials
5. Returns: JWT token + user data
6. App stores token in AsyncStorage
7. Token injected into axios headers
8. User navigated to dashboard
```

### Signup Process

```
1. User fills: fullName, email, password, role
2. Press Sign Up button
3. API request sent: POST /signup
4. Backend creates user account
5. Returns: JWT token + user data
6. Same as login flow after this
```

### Token Persistence

```
1. On app startup, check AsyncStorage for token
2. If token exists, auto-login
3. Load user dashboard
4. If token invalid, show login screen
```

---

## 📊 Dashboard Types

### Student Dashboard

**Endpoint:** `GET /api/student/dashboard`

**Displays:**
```
Profile Information
- Name
- Email
- Student ID

Attendance Summary
- Total records
- Present count
- Absent count
- Percentage

Marks Summary
- Total marks
- Average score
- Subjects count
```

### Teacher Dashboard

**Endpoint:** `GET /api/teacher/dashboard`

**Displays:**
```
Class Overview
- Assigned students
- Total classes
- Average class size

Attendance Statistics
- Average attendance %
- Total records
- Present count
- Absent count

Marks Entry
- Total entries
- Average score
- Subject list
```

### Admin Dashboard

**Endpoint:** `GET /api/admin/dashboard`

**Displays:**
```
System Overview
- Total students
- Total teachers
- Total admins

User Statistics
- Students count
- Teachers count
- Admins count

Attendance Rates
- Average %
- Total records
```

---

## 🔌 API Integration

### Axios Setup

```javascript
// Making API calls
const response = await api.post('/login', {
  email: 'user@example.com',
  password: 'password'
});

// With authentication
const response = await api.get('/api/student/dashboard');
// Token automatically included in headers
```

### Error Handling

```javascript
try {
  const result = await login(email, password);
  if (result.success) {
    // Navigate to dashboard
  } else {
    // Show error: result.error
  }
} catch (error) {
  console.log('Login failed:', error);
}
```

---

## 🎨 UI Components

### LoginScreen Components

| Component | Purpose |
|-----------|---------|
| TextInput | Email/password input fields |
| Button | Login/Signup action |
| ActivityIndicator | Loading state |
| View | Layout containers |
| ScrollView | Scrollable content |

### DashboardScreen Components

| Component | Purpose |
|-----------|---------|
| ScrollView | Scrollable dashboard |
| RefreshControl | Pull-to-refresh |
| Card | Data containers |
| Text | Labels and values |
| TouchableOpacity | Logout button |

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Login with student account
- [ ] View student dashboard
- [ ] Logout from student account
- [ ] Login with teacher account
- [ ] View teacher dashboard
- [ ] Logout from teacher account
- [ ] Login with admin account
- [ ] View admin dashboard
- [ ] Test pull-to-refresh
- [ ] Test error handling (invalid credentials)
- [ ] Test network timeout handling
- [ ] Test app restart with saved token

### Test Credentials

```
STUDENT: alice.student@school.com / StudentPass123!
TEACHER: bob.teacher@school.com / TeacherPass123!
ADMIN: charlie.admin@school.com / AdminPass123!
```

---

## 🐛 Debugging

### Enable Console Logs

```javascript
// In components
console.log('Login attempt:', email);
console.log('Response:', response.data);
console.log('Error:', error.message);
```

### Inspect Network Requests

```bash
# Run app with debugging
npm start
# Press 'j' in terminal to open debugger
```

### Check AsyncStorage

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Read token
const token = await AsyncStorage.getItem('userToken');
console.log('Stored token:', token);

// Clear storage
await AsyncStorage.removeItem('userToken');
```

---

## 🔄 State Management

### Using AuthContext

```javascript
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

function MyComponent() {
  const { user, token, login, logout, loading, error } = 
    useContext(AuthContext);

  return (
    // Use context values and functions
  );
}
```

### State Values

| State | Type | Purpose |
|-------|------|---------|
| user | Object | Current user data |
| token | String | JWT token |
| loading | Boolean | API call status |
| error | String | Error message |
| isSignedIn | Boolean | Auth status |

---

## 📱 Running on Different Platforms

### Web Browser

```bash
npm start
# Press 'w' in terminal
# Opens at http://localhost:19006
```

### iOS Simulator (Mac only)

```bash
npm start
# Press 'i' in terminal
# Requires Xcode and iOS simulator
```

### Android Emulator

```bash
npm start
# Press 'a' in terminal
# Requires Android Studio and emulator setup
```

### Physical Device (Recommended)

```bash
npm start
# Scan QR code with Expo Go app
# App opens on phone
```

---

## 🚀 Building for Production

### Generate APK (Android)

```bash
expo build:android -t apk
```

### Generate IPA (iOS)

```bash
expo build:ios -t ipa
```

### Build for Web

```bash
expo build:web
```

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Axios Documentation](https://axios-http.com)
- [AsyncStorage Guide](https://react-native-async-storage.github.io/async-storage)

---

## 🎯 Future Enhancements

1. **Add Navigation Library**
   - React Navigation
   - Expo Router integration

2. **Improve UI**
   - Custom theme system
   - Animation library (Reanimated)
   - Icon library (Expo Icons)

3. **Additional Features**
   - Push notifications
   - Camera integration
   - File uploads
   - Offline mode (Redux Persist)

4. **Performance**
   - Lazy loading
   - Image optimization
   - Code splitting

5. **Testing**
   - Jest unit tests
   - React Native Testing Library
   - E2E testing (Detox)

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| Network timeout | Update PC_IP, check WiFi connection |
| Invalid token | Clear AsyncStorage, re-login |
| Module not found | Run `npm install` |
| Port 5000 refused | Start backend server |
| App crashes | Check console logs, restart CLI |
| Blank screen | Check API response, verify data |

---

**Development Status:** ✅ Ready for Testing
**Last Updated:** June 3, 2026
**Version:** 1.0.0
