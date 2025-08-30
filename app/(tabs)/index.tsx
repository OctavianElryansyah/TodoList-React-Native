import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selamat Datang di ToDo App!</Text>
      <Text style={styles.subtitle}>
        Kelola tugas harianmu dengan mudah, cepat, dan terorganisir.
      </Text>

      <View style={styles.card}>
        <Ionicons name="list-circle-outline" size={48} color="#007AFF" style={{ marginBottom: 8 }} />
        <Text style={styles.cardTitle}>Fitur Utama</Text>
        <Text style={styles.cardText}>• Tambah, edit, hapus, dan ceklis tugas</Text>
        <Text style={styles.cardText}>• Filter tugas berdasarkan kategori</Text>
        <Text style={styles.cardText}>• Edit profil dan logout</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/todo")}
      >
        <Ionicons name="add-circle-outline" size={22} color="#fff" />
        <Text style={styles.buttonText}>Mulai Buat ToDo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f6f8fa" },
  title: { fontSize: 24, fontWeight: "bold", color: "#007AFF", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#444", marginBottom: 18, textAlign: "center", paddingHorizontal: 24 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: 320,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#007AFF", marginBottom: 8 },
  cardText: { fontSize: 14, color: "#333", marginBottom: 2 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16, marginLeft: 8 },
});