import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';

export default function WebBoard() {
  const [posts, setPosts] = useState([
    { id: '1', title: 'ยินดีต้อนรับสู่บอร์ดใหม่!', author: 'Admin' },
    { id: '2', title: 'สอบถามเรื่องการรัน Expo บน Render ครับ', author: 'User123' },
  ]);
  const [newPost, setNewPost] = useState('');

  const addPost = () => {
    if (newPost.trim()) {
      setPosts([{ id: Date.now().toString(), title: newPost, author: 'Me' }, ...posts]);
      setNewPost('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Web Board</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="ตั้งกระทู้ใหม่..." 
          value={newPost}
          onChangeText={setNewPost}
        />
        <TouchableOpacity style={styles.postButton} onPress={addPost}>
          <Text style={styles.postButtonText}>โพสต์</Text>
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
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#ddd' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#007AFF' },
  inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#fff' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 15, marginRight: 10 },
  postButton: { backgroundColor: '#007AFF', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, justifyContent: 'center' },
  postButtonText: { color: '#fff', fontWeight: 'bold' },
  postCard: { backgroundColor: '#fff', padding: 15, marginHorizontal: 15, marginTop: 10, borderRadius: 10, elevation: 2 },
  postTitle: { fontSize: 18, fontWeight: '600' },
  postAuthor: { color: '#888', marginTop: 5, fontSize: 12 }
});