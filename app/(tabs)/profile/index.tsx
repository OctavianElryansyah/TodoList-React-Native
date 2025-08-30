import { View, Text, StyleSheet, Button, TextInput, Alert, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      setEmail(user?.email ?? "");

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", user.id)
          .single();
        if (!error && data) setName(data.name);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ name })
      .eq("id", user.id);

    if (error) Alert.alert("Error", error.message);
    else {
      setEditing(false);
      Alert.alert("Berhasil", "Nama berhasil diubah");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("(auth)/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://ui-avatars.com/api/?name=" + encodeURIComponent(name || "User") + "&background=007AFF&color=fff&size=128" }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.label}>Email</Text>
        <View style={styles.row}>
          <Ionicons name="mail-outline" size={18} color="#007AFF" />
          <Text style={styles.value}>{email}</Text>
        </View>
        <Text style={styles.label}>Nama</Text>
        <View style={styles.row}>
          <Ionicons name="person-outline" size={18} color="#007AFF" />
          {editing ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nama"
            />
          ) : (
            <Text style={styles.value}>{name}</Text>
          )}
        </View>
        <View style={styles.buttonRow}>
          {editing ? (
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>Simpan</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
              <Ionicons name="create-outline" size={20} color="#007AFF" />
              <Text style={styles.editBtnText}>Edit Nama</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f6f8fa" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
  avatarContainer: { marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#eee" },
  label: { fontSize: 14, fontWeight: "bold", color: "#888", marginTop: 12 },
  value: { fontSize: 16, color: "#222", marginLeft: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginLeft: 8,
    width: 160,
    backgroundColor: "#f6f8fa",
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  buttonRow: { flexDirection: "row", marginTop: 18, gap: 12 },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f0ff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editBtnText: { color: "#007AFF", fontWeight: "bold", marginLeft: 6 },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveBtnText: { color: "#fff", fontWeight: "bold", marginLeft: 6 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6347",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutBtnText: { color: "#fff", fontWeight: "bold", marginLeft: 6 },
});