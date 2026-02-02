import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Expo Web 🌐</Text>

      <Text style={styles.text}>
        ตอนนี้กำลังรันบน: {Platform.OS}
      </Text>

      <Button
        title="กดทดสอบ"
        onPress={() => alert('Expo Web ใช้งานได้แล้ว 🎉')}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});
