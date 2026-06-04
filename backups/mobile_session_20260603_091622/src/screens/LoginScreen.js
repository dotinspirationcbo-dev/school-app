import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('alice.student@school.com');
  const [password, setPassword] = useState('StudentPass123!');
  const [isSignup, setIsSignup] = useState(false);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');

  const { login, signup, loading, error } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const result = await signup(fullName, email, password, role);
    if (!result.success) {
      Alert.alert('Signup Failed', result.error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <Text style={styles.title}>
          {isSignup ? 'Create Account' : 'School App'}
        </Text>
        <Text style={styles.subtitle}>
          {isSignup
            ? 'Sign up to get started'
            : 'Login to your account'}
        </Text>

        {/* Error Message */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Signup Fields */}
        {isSignup && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              editable={!loading}
            />

            {/* Role Selection */}
            <Text style={styles.label}>Select Role:</Text>
            <View style={styles.roleContainer}>
              {['student', 'teacher', 'admin'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.roleButton,
                    role === r && styles.roleButtonActive,
                  ]}
                  onPress={() => setRole(r)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      role === r && styles.roleButtonTextActive,
                    ]}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={!loading}
          autoCapitalize="none"
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        {/* Test Credentials Info */}
        {!isSignup && (
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Test Credentials:</Text>
            <Text style={styles.infoText}>
              📱 Student: alice.student@school.com
            </Text>
            <Text style={styles.infoText}>👨‍🏫 Teacher: bob.teacher@school.com</Text>
            <Text style={styles.infoText}>🛡️ Admin: charlie.admin@school.com</Text>
            <Text style={styles.infoText}>🔑 Password: *Pass123!</Text>
          </View>
        )}

        {/* Login/Signup Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={isSignup ? handleSignup : handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isSignup ? 'Sign Up' : 'Login'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Toggle Signup/Login */}
        <TouchableOpacity
          onPress={() => setIsSignup(!isSignup)}
          disabled={loading}
        >
          <Text style={styles.toggleText}>
            {isSignup
              ? 'Already have an account? Login'
              : "Don't have an account? Sign up"}
          </Text>
        </TouchableOpacity>

        {/* Connection Info */}
        <View style={styles.connectionInfo}>
          <Text style={styles.connectionLabel}>
            ⚠️ IMPORTANT - Before Testing:
          </Text>
          <Text style={styles.connectionText}>
            1. Edit src/api/api.js
          </Text>
          <Text style={styles.connectionText}>
            2. Change PC_IP to your computer's IPv4 address
          </Text>
          <Text style={styles.connectionText}>
            3. Run ipconfig in terminal to find it (192.168.x.x)
          </Text>
          <Text style={styles.connectionText}>
            4. Backend must be running on port 5000
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  innerContainer: {
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  roleButtonTextActive: {
    color: '#007AFF',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleText: {
    textAlign: 'center',
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  infoText: {
    color: '#1565c0',
    fontSize: 13,
    marginBottom: 4,
  },
  connectionInfo: {
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
    marginTop: 20,
  },
  connectionLabel: {
    fontWeight: 'bold',
    color: '#e65100',
    marginBottom: 8,
  },
  connectionText: {
    color: '#bf360c',
    fontSize: 12,
    marginBottom: 4,
  },
});
