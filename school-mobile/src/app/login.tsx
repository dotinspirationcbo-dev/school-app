import { useContext, useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { router } from "expo-router";
import AnimatedButton from "../components/ui/AnimatedButton";
import { toast } from "../utils/toast";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const { login, isSignedIn, initializing, error } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!initializing && isSignedIn) {
      router.replace("../dashboard");
    }
  }, [initializing, isSignedIn]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast("Error", "Please fill all fields");
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      toast("Success", "Welcome back!");
      router.replace("../dashboard");
    } else {
      toast("Login Failed", result.error || "Invalid credentials");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        School Login
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          width: "100%",
          padding: 12,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          width: "100%",
          padding: 12,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginBottom: 20,
        }}
      />

      <AnimatedButton
        title="Login"
        onPress={handleLogin}
        style={{ backgroundColor: "black" }}
      />
      {error ? <Text style={{ marginTop: 12, color: "#d12c2c" }}>{error}</Text> : null}
    </View>
  );
}
