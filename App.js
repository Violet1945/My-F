import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  SafeAreaView, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';

// --- 1. นำเข้า Firebase และฟังก์ชันที่จำเป็น ---
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

// --- 2. วางค่า Config จาก Firebase Console ของคุณตรงนี้ ---
const firebaseConfig = {
  apiKey: "AIza...", 
  authDomain: "test01-4bae4.firebaseapp.com",
  projectId: "test01-4bae4",
  storageBucket: "test01-4bae4.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// เริ่มต้น Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([]); // เริ่มต้นด้วยลิสต์ว่างเพื่อรอข้อมูลจาก Firebase
  const [loading, setLoading] = useState(false);

  // --- 3. ดึงข้อมูลจาก Firebase แบบ Real-time ---
  useEffect(() => {
    // สร้าง Query เรียงลำดับตามเวลาสร้าง (ใหม่ไปเก่า)
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    
    // ฟังการเปลี่ยนแปลงของข้อมูล
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firebaseData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(firebaseData); // อัปเดต State ด้วยข้อมูลจาก Cloud
    }, (error) => {
      console.error("Firebase Error: ", error);
    });

    return () => unsubscribe(); // ยกเลิกการฟังเมื่อปิดหน้าจอ
  }, []);

  // ฟังก์ชัน Login
  const handleLogin = () => {
    if (email && password) {
      setIsLoggedIn(true);
    } else {
      alert('กรุณากรอกอีเมลและรหัสผ่าน');
    }
  };

  // --- 4. ฟังก์ชันส่งโพสต์ไปที่ Firebase (ของจริง) ---
  const addPost = async () => {
    if (newPost.trim()) {
      setLoading(true);
      try {
        // เพิ่มข้อมูลลง Collection ชื่อ "posts"
        await addDoc(collection(db, "posts"), {
          title: newPost,
          author: email,
          createdAt: new Date() // ใส่เวลาเซิร์ฟเวอร์
        });
        setNewPost(''); // ล้างช่องพิมพ์เมื่อสำเร็จ
      } catch (e) {
        alert("โพสต์ไม่สำเร็จ: " + e.message);
      }
      setLoading(false);
    }
  };

  // --- UI หน้า Login ---
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Web Board Login</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            value={email} 
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            secureTextEntry 
            value={password} 
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- UI หน้า Web Board ---
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>กระทู้ล่าสุด (Cloud)</Text>
        <TouchableOpacity onPress={() => setIsLoggedIn(false)}>
          <Text style={{color: 'red'}}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputSection}>
        <TextInput 
          style={[styles.input, {marginBottom: 0, flex: 1}]} 
          placeholder="เขียนอะไรบางอย่างลง Cloud..." 
          value={newPost}
          onChangeText={setNewPost}
        />
        <TouchableOpacity 
          style={[styles.postButton, {opacity: loading ? 0.5 : 1}]} 
          onPress={addPost}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>ส่ง</Text>}
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postAuthor}>โดย: {item.author}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>ยังไม่มีโพสต์ในฐานข้อมูล</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', marginBottom: 15 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  header: { padding: 20, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  inputSection: { flexDirection: 'row', padding: 10, backgroundColor: '#fff' },
  postButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 10, marginLeft: 10, justifyContent: 'center', minWidth: 60 },
  postCard: { backgroundColor: '#fff', padding: 15, margin: 10, borderRadius: 10, borderLeftWidth: 5, borderLeftColor: '#007AFF' },
  postTitle: { fontSize: 16, fontWeight: '500' },
  postAuthor: { fontSize: 12, color: '#888', marginTop: 5 }
});