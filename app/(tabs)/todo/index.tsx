import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from "react-native";
import { supabase } from "../../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";

interface Todo {
  id: string;
  title: string;
  is_done: boolean;
  user_id: string;
  kategori: string;
}

const kategoriList = ["Biasa aja", "Penting", "Penting banget"];

const kategoriColor: Record<string, string> = {
  "Biasa aja": "#eee",
  "Penting": "#FFD700",
  "Penting banget": "#FF6347",
};

export default function TodoScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [kategori, setKategori] = useState("Biasa aja");
  const [filter, setFilter] = useState("Semua");

  // fetch todos dari supabase
  const fetchTodos = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) console.log(error);
    else setTodos(data as Todo[]);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // add new todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;

    const { data, error } = await supabase
      .from("todos")
      .insert([{
        title: newTodo,
        is_done: false,
        kategori,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }])
      .select();

    if (error) {
      console.log(error);
    } else if (data && data.length > 0) {
      setTodos((prev) => [data[0], ...prev]);
      setNewTodo("");
      setKategori("Biasa aja");
    }
  };

  // toggle selesai / belum selesai
  const toggleTodo = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("todos")
      .update({ is_done: !current })
      .eq("id", id);

    if (error) console.log(error);
    else {
      setTodos(todos.map((t) => (t.id === id ? { ...t, is_done: !current } : t)));
    }
  };

  // hapus todo
  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) console.log(error);
    else setTodos(todos.filter((t) => t.id !== id));
  };

  // mulai edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const startEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditingText(title);
  };

  // simpan edit
  const saveEdit = async () => {
    if (!editingText || !editingId) return;

    const { error } = await supabase
      .from("todos")
      .update({ title: editingText })
      .eq("id", editingId);

    if (error) {
      console.log(error);
      return;
    }

    setTodos(todos.map((t) => (t.id === editingId ? { ...t, title: editingText } : t)));
    setEditingId(null);
    setEditingText("");
  };

  // filter todos
  const filteredTodos = filter === "Semua"
    ? todos
    : todos.filter((t) => t.kategori === filter);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Input Todo Baru */}
      <TextInput
        placeholder="Tambah todo..."
        value={newTodo}
        onChangeText={setNewTodo}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />
      {/* Pilih kategori */}
      <View style={{ marginBottom: 1 }}>
        <Text style={{ marginBottom: 1 }}>Kategori:</Text>
        <Picker
          selectedValue={kategori}
          style={{ height: 50, width: 200 }}
          onValueChange={(itemValue) => setKategori(itemValue)}
        >
          {kategoriList.map((k) => (
            <Picker.Item key={k} label={k} value={k} />
          ))}
        </Picker>
      </View>
      <Button title="Tambah" onPress={addTodo} />

      {/* Filter kategori */}
      <View style={{ flexDirection: "row", marginVertical: 10 }}>
        {["Semua", ...kategoriList].map((k) => (
          <TouchableOpacity
            key={k}
            style={{
              padding: 8,
              backgroundColor: filter === k ? "#007AFF" : "#eee",
              borderRadius: 5,
              marginRight: 8,
            }}
            onPress={() => setFilter(k)}
          >
            <Text style={{ color: filter === k ? "#fff" : "#333" }}>{k}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Daftar Todo */}
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              marginBottom: 10,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              padding: 12,
              borderLeftWidth: 6,
              borderLeftColor: kategoriColor[item.kategori] || "#eee",
            }}
          >
            <TouchableOpacity
              onPress={() => toggleTodo(item.id, item.is_done)}
              style={{ marginRight: 12 }}
            >
              <Ionicons
                name={item.is_done ? "checkbox" : "square-outline"}
                size={28}
                color={item.is_done ? "#007AFF" : "#888"}
              />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  textDecorationLine: item.is_done ? "line-through" : "none",
                  color: item.is_done ? "#888" : "#222",
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: kategoriColor[item.kategori] || "#888",
                  marginTop: 2,
                  fontWeight: "bold",
                }}
              >
                {item.kategori}
              </Text>
            </View>
            {editingId === item.id ? (
              <View style={{ flexDirection: "row", gap: 5 }}>
                <TextInput
                  value={editingText}
                  onChangeText={setEditingText}
                  style={{ borderWidth: 1, padding: 5, width: 120, borderRadius: 5 }}
                />
                <Button title="Save" onPress={saveEdit} />
              </View>
            ) : (
              <View style={{ flexDirection: "row", gap: 5 }}>
                <TouchableOpacity onPress={() => startEdit(item.id, item.title)}>
                  <Ionicons name="create-outline" size={22} color="#007AFF" style={{ marginRight: 8 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTodo(item.id)}>
                  <Ionicons name="trash-outline" size={22} color="#FF6347" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}