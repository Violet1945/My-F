import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  SafeAreaView, FlatList, ActivityIndicator 
} from 'react-native';

// --- 1. นำเข้า Firebase ---
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

// --- 2. ตั้งค่า Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyDrJHAZF2Nucn3i3DNgQjq6acgkYCFOwn4",
  authDomain: "test01-4bae4.firebaseapp.com",
  projectId: "test01-4bae4",
  storageBucket: "test01-4bae4.firebasestorage.app",
  messagingSenderId: "964388017629",
  appId: "1:964388017629:web:e593e8b4d6bfe9f8369234",
  measurementId: "G-TM1H9XF2ND"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(false);

  // --- 3. ดึงข้อมูลแบบ Real-time ---
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firebaseData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(firebaseData);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    if (email && password) setIsLoggedIn(true);
    else alert('กรุณากรอกอีเมลและรหัสผ่าน');
  };

  const addPost = async () => {
    if (newPost.trim()) {
      setLoading(true);
      try {
        await addDoc(collection(db, "posts"), {
          title: newPost,
          author: email,
          createdAt: new Date() 
        });
        setNewPost('');
      } catch (e) {
        alert("โพสต์ไม่สำเร็จ: " + e.message);
      }
      setLoading(false);
    }
  };

  // --- 4. ฟังก์ชันแสดงแต่ละโพสต์ (Render Item) ---
  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8}}>
        <Text style={styles.postAuthor}>โดย: {item.author}</Text>
        {/* แสดงเวลาที่ดึงมาจาก Firebase */}
        <Text style={{fontSize: 10, color: '#bbb'}}>
          {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString('th-TH') : 'กำลังโหลด...'}
        </Text>
      </View>
    </View>
  );

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Web Board Login</Text>
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>กระทู้ล่าสุด (Cloud)</Text>
        <TouchableOpacity onPress={() => setIsLoggedIn(false)}>
          <Text style={{color: 'red', fontWeight: 'bold'}}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputSection}>
        <TextInput 
          style={[styles.input, {marginBottom: 0, flex: 1}]} 
          placeholder="เขียนอะไรบางอย่างลง Cloud..." 
          value={newPost}
          onChangeText={setNewPost}
        />
        <TouchableOpacity style={styles.postButton} onPress={addPost} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>ส่ง</Text>}
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderPost}
        ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20, color: '#999'}}>ยังไม่มีโพสต์ในขณะนี้</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', marginBottom: 15 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  header: { padding: 20, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  inputSection: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  postButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 10, marginLeft: 10, justifyContent: 'center', minWidth: 60, alignItems: 'center' },
  postCard: { backgroundColor: '#fff', padding: 15, marginHorizontal: 15, marginTop: 15, borderRadius: 12, borderLeftWidth: 5, borderLeftColor: '#007AFF', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  postTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  postAuthor: { fontSize: 12, color: '#666' }
});