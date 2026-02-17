import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, Image, FlatList, 
  SafeAreaView, ActivityIndicator, StatusBar, 
  TouchableOpacity, Modal, ScrollView, Dimensions,
  TextInput
} from 'react-native';
// นำเข้าไอคอนจาก Expo
import { Ionicons } from '@expo/vector-icons';
// นำเข้า LinearGradient สำหรับหัวแอป
import { LinearGradient } from 'expo-linear-gradient';

// --- 1. นำเข้า Firebase ---
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

// --- 2. Firebase Config (ใช้ค่าจากโปรเจกต์ travelplaces-79e29 ของนาย) ---
const firebaseConfig = {
  apiKey: "AIzaSyDrJHAZF2Nucn3i3DNgQjq6acgkYCFOwn4", 
  authDomain: "travelplaces-79e29.firebaseapp.com",
  projectId: "travelplaces-79e29",
  storageBucket: "travelplaces-79e29.firebasestorage.app",
  messagingSenderId: "964388017629", 
  appId: "1:964388017629:web:e593e8b4d6bfe9f8369234" 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const { width } = Dimensions.get('window');

export default function App() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [search, setSearch] = useState('');

  // กรองข้อมูลตามคำค้นหา
  const filteredPlaces = places.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

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
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.95}
      onPress={() => setSelectedPlace(item)} 
    >
      <Image 
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image' }} 
        style={styles.cardImage} 
      />
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text style={styles.placeName}>{item.name}</Text>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          </View>
        </View>
        <Text style={styles.locationText}>📍 {item.location}</Text>
        
        {/* หน้าแรกโชว์สั้นๆ */}
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.footerLine}>
          <Text style={styles.moreInfoBtn}>อ่านข้อมูลเชิงลึกเพิ่มเติม →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* ส่วนหัวแอป */}
      <LinearGradient
        colors={['#00A8E8', '#0A3D62']}
        style={styles.topHeader}
      >
        <Text style={styles.headerSubtitle}>เที่ยวลำพูนง่ายๆ กับ</Text>
        <Text style={styles.headerTitle}>LAMPHUN GUIDE 🏯</Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{marginTop: 10, color: '#999'}}>กำลังโหลดที่เที่ยวสวยๆ...</Text>
        </View>
      ) : (
        <>
          {/* search bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#777" style={{marginRight:10}} />
            <TextInput
              style={styles.searchInput}
              placeholder="ค้นหาสถานที่..."
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <FlatList 
            data={filteredPlaces} 
            keyExtractor={item => item.id} 
            renderItem={renderPlace} 
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.center}>
                <Text style={{color: '#999'}}>ไม่พบผลลัพธ์</Text>
              </View>
            )}
          />
        </>
      )}

      {/* --- 🖼️ Modal: หน้าแสดงข้อมูลที่ไม่ได้โชว์ในช่องหลัก --- */}
      <Modal visible={!!selectedPlace} animationType="slide" presentationStyle="fullScreen">
        {selectedPlace && (
          <View style={styles.modalView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Image source={{ uri: selectedPlace.imageUrl }} style={styles.modalImage} />
              
              <TouchableOpacity 
                style={styles.backFab} 
                onPress={() => setSelectedPlace(null)}
              >
                <Text style={{fontSize: 20}}>✕</Text>
              </TouchableOpacity>

              <View style={styles.modalBody}>
                <Text style={styles.modalTitle}>{selectedPlace.name}</Text>
                <Text style={styles.modalLocation}>📍 {selectedPlace.location}</Text>
                
                <View style={styles.modalStats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>คะแนนความนิยม</Text>
                        <Text style={styles.statValue}>⭐ {selectedPlace.rating} / 5</Text>
                    </View>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>📖 รายละเอียดและประวัติที่น่าสนใจ</Text>
                    {/* ตรงนี้จะโชว์ข้อความยาวๆ ทั้งหมดที่นายกรอกใน Firebase */}
                    <Text style={styles.fullDescription}>{selectedPlace.description}</Text>
                </View>

                <TouchableOpacity 
                  style={styles.closeBtn} 
                  onPress={() => setSelectedPlace(null)}
                >
                  <Text style={styles.closeBtnText}>กลับไปหน้าหลัก</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topHeader: {
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: '#00A8E8', // สีสำรองถ้า gradient ไม่ทำงาน
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerSubtitle: { fontSize: 14, color: '#fff', fontWeight: '600', letterSpacing: 1 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 5 },
  listPadding: { padding: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    marginBottom: 25,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardImage: { width: '100%', height: 280 },
  cardContent: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  placeName: { fontSize: 22, fontWeight: 'bold', color: '#333', flex: 1 },
  ratingBox: { backgroundColor: '#FFF9E5', padding: 8, borderRadius: 12 },
  ratingText: { color: '#FFA000', fontWeight: 'bold' },
  locationText: { color: '#007AFF', marginVertical: 8, fontWeight: '600' },
  description: { color: '#777', fontSize: 15, lineHeight: 22 },
  footerLine: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  moreInfoBtn: { color: '#00A8E8', fontWeight: 'bold', textAlign: 'right' },

  // search bar styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  // Modal Styles
  modalView: { flex: 1, backgroundColor: '#fff' },
  modalImage: { width: width, height: 450 },
  backFab: {
    position: 'absolute', top: 50, left: 20,
    backgroundColor: '#fff', width: 45, height: 45,
    borderRadius: 25, justifyContent: 'center', alignItems: 'center',
    elevation: 5
  },
  modalBody: { padding: 30, marginTop: -30, backgroundColor: '#fff', borderTopLeftRadius: 35, borderTopRightRadius: 35 },
  modalTitle: { fontSize: 30, fontWeight: 'bold', color: '#1A1A1A' },
  modalLocation: { fontSize: 18, color: '#007AFF', marginTop: 10 },
  modalStats: { marginVertical: 25, padding: 20, backgroundColor: '#F8F9FD', borderRadius: 20 },
  statLabel: { color: '#999', fontSize: 14 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 5 },
  infoSection: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  fullDescription: { fontSize: 16, color: '#555', lineHeight: 28 },
  closeBtn: { backgroundColor: '#007AFF', padding: 20, borderRadius: 20, alignItems: 'center', marginBottom: 50 },
  closeBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});