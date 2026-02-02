import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  SafeAreaView, FlatList, KeyboardAvoidingView, Platform 
} from 'react-native';

export default function App() {
  // --- 1. ส่วนเก็บข้อมูล (States) ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([
    { id: '1', title: 'ยินดีต้อนรับสู่ Web Board ของฉัน!', author: 'Admin' },
    { id: '2', title: 'รันบน Render สำเร็จแล้วครับ!', author: 'System' },
  ]);

  // --- 2. ฟังก์ชันการทำงาน (Functions) ---
  const handleLogin = () => {
    if (email.trim() && password.trim()) {
      setIsLoggedIn(true);
    } else {
      alert('กรุณากรอกอีเมลและรหัสผ่านให้ครบครับ');
    }
  };

  const addPost = () => {
    if (newPost.trim()) {
      const postData = { 
        id: Date.now().toString(), 
        title: newPost, 
        author: email 
      };
      setPosts([postData, ...posts]); // เพิ่มโพสต์ใหม่ไว้บนสุด
      setNewPost(''); // ล้างช่องพิมพ์
    }
  };

  // --- 3. ส่วนแสดงผล (UI) ---
  if (!isLoggedIn) {
    // แสดงหน้า LOGIN
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>MY WEB BOARD</Text>
          <View style={styles.form}>
            <Text style={styles.label}>อีเมล</Text>
            <TextInput style={styles.input} placeholder="example@mail.com" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <Text style={styles.label}>รหัสผ่าน</Text>
            <TextInput style={styles.input} placeholder="รหัสผ่าน" value={password} onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // แสดงหน้า WEB BOARD (หลังจาก Login แล้ว)
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>กระทู้ล่าสุด</Text>
        <TouchableOpacity onPress={() => setIsLoggedIn(false)}>
          <Text style={{color: 'red', fontWeight: 'bold'}}>ออกระบบ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputSection}>
        <TextInput 
          style={styles.inputMain} 
          placeholder="คุณกำลังคิดอะไรอยู่..." 
          value={newPost} 
          onChangeText={setNewPost} 
        />
        <TouchableOpacity style={styles.postButton} onPress={addPost}>
          <Text style={styles.buttonText}>โพสต์</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardAuthor}>โดย: {item.author}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// --- 4. ส่วนตกแต่ง (Styles) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#007AFF' },
  form: { backgroundColor: '#fff', padding: 25, borderRadius: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  input: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', marginBottom: 15 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  header: { padding: 20, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee' },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  inputSection: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', marginBottom: 5 },
  inputMain: { flex: 1, backgroundColor: '#f0f2f5', padding: 12, borderRadius: 25, paddingHorizontal: 20 },
  postButton: { backgroundColor: '#007AFF', paddingHorizontal: 25, borderRadius: 25, marginLeft: 10, justifyContent: 'center' },
  card: { backgroundColor: '#fff', padding: 20, marginHorizontal: 15, marginTop: 15, borderRadius: 15, borderLeftWidth: 6, borderLeftColor: '#007AFF', elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#1c1e21' },
  cardAuthor: { fontSize: 13, color: '#65676b', marginTop: 10 }
});