import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Login gagal", error.message);
      return;
    }

    router.replace("(tabs)");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="lock-closed-outline" size={48} color="#007AFF" style={{ marginBottom: 12 }} />
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputRow}>
          <Ionicons name="mail-outline" size={20} color="#007AFF" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputRow}>
          <Ionicons name="key-outline" size={20} color="#007AFF" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Ionicons name="log-in-outline" size={20} color="#fff" />
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>
        <Link href="(auth)/register" style={styles.link}>
          Belum punya akun? Register
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f6f8fa" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 28,
    width: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#007AFF", marginBottom: 18 },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 14, width: "100%" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
    backgroundColor: "#f6f8fa",
  },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 8,
  },
  loginBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16, marginLeft: 8 },
  link: { color: "#007AFF", marginTop: 8, fontWeight: "bold" },
});