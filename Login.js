import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const Login = ({ navigation }) => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>BM</Text>
      <Text style={styles.subtitle}>Bismarck</Text>

      <View style={styles.box}>
        <Text style={styles.label}>name</Text>
        <TextInput
          placeholder="fill your name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>email</Text>
        <TextInput
          placeholder="fill your email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>==Enter==</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default Login
