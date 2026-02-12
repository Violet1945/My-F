import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, Image, FlatList, 
  SafeAreaView, ActivityIndicator, StatusBar 
} from 'react-native';

// --- 1. นำเข้า Firebase ---
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

// --- 2. Firebase Config (อัปเดตตามรูปโปรเจกต์ของนายแล้ว) ---
const firebaseConfig = {
  // ⚠️ นายต้องเอา API Key จริงจากหน้า Project Settings มาใส่ตรงนี้แทน "AIza..." นะครับ
  apiKey: "AIzaSyDrJHAZF2Nucn3i3DNgQjq6acgkYCFOwn4", 
  authDomain: "travelplaces-79e29.firebaseapp.com",
  projectId: "travelplaces-79e29",
  storageBucket: "travelplaces-79e29.firebasestorage.app",
  messagingSenderId: "964388017629", 
  appId: "1:964388017629:web:e593e8b4d6bfe9f8369234" 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const colRef = collection(db, "travel_places");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlaces(data);
      setLoading(false);
    }, (error) => {
      console.error("Firebase Error: ", error.message);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const renderPlace = ({ item }) => (
    <View style={styles.card}>
      {/* 🖼️ ปรับรูปให้สูงขึ้นเป็น 300 */}
      <Image 
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image' }} 
        style={styles.cardImage} 
      />
      
      {/* 📝 เพิ่ม Padding ให้ช่องเนื้อหาสูงและโปร่งขึ้น */}
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text style={styles.placeName}>{item.name}</Text>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          </View>
        </View>

        <Text style={styles.locationText}>📍 {item.location}</Text>
        
        {/* 📖 ปรับระยะบรรทัด (lineHeight) ให้ช่องคำบรรยายดูสูงและอ่านง่าย */}
        <Text style={styles.description}>
          {item.description}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.moreInfo}>ดูข้อมูลเพิ่มเติม...</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topHeader}>
        <Text style={styles.brandText}>ลำพูน Travel Guide ⛩️</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={places}
          keyExtractor={item => item.id}
          renderItem={renderPlace}
          contentContainerStyle={styles.listPadding}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topHeader: {
    paddingVertical: 40, // เพิ่มความสูง Header
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    elevation: 2,
  },
  brandText: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' },
  listPadding: { padding: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 30, // เพิ่มระยะห่างระหว่างช่อง
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardImage: { 
    width: '100%', 
    height: 500, // 🔥 ปรับความสูงรูปภาพให้สูงสะใจ
    backgroundColor: '#ddd' 
  },
  cardContent: { 
    padding: 25, // 🔥 เพิ่มพื้นที่ว่างข้างในให้ดูสูงขึ้น
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 10
  },
  placeName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  ratingBox: { backgroundColor: '#fff9e5', padding: 8, borderRadius: 10 },
  ratingText: { color: '#ffa000', fontWeight: 'bold', fontSize: 16 },
  locationText: { color: '#007aff', marginBottom: 15, fontSize: 16, fontWeight: '600' },
  description: { 
    color: '#555', 
    fontSize: 15, 
    lineHeight: 50, // 🔥 เพิ่มระยะห่างระหว่างบรรทัด
    marginBottom: 20 
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
    alignItems: 'flex-end'
  },
  moreInfo: { color: '#007aff', fontWeight: 'bold' }
});