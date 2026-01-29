import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

import api from '../api/apiClient'
import { tokenStorage } from '../auth/tokenStorage'

export default function Profile() {
  const { signOut } = useAuth()
  const { user } = useUser()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      // 1️⃣ Get refresh token
      const refreshToken = await tokenStorage.getRefreshToken()

      // 2️⃣ Inform backend (invalidate refresh token)
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken })
      }

      // 3️⃣ Clear frontend tokens
      await tokenStorage.clear()

      // 4️⃣ Sign out from Clerk
      await signOut()

      // 5️⃣ Redirect to Sign In
      router.replace('/auth/sign-in')
    } catch (err: any) {
      console.log('Logout error:', err)
      Alert.alert(
        'Logout Failed',
        'Something went wrong. Please try again.'
      )
    }
  }

  return (
    <View style={styles.container}>
      {/* PROFILE HEADER */}
      <View style={styles.card}>
        <Text style={styles.name}>
          {user?.fullName || 'Ziptron User'}
        </Text>
        <Text style={styles.email}>
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      {/* ACCOUNT OPTIONS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.item}>
          <Text style={styles.itemText}>My Vehicles</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.itemText}>Charging History</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.itemText}>Payment Methods</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.itemText}>Support</Text>
        </View>
      </View>

      {/* SIGN OUT */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleSignOut}
        activeOpacity={0.85}
      >
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },

  card: {
    backgroundColor: '#ECFDF5',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },

  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#022C22',
  },

  email: {
    marginTop: 4,
    color: '#6B7280',
  },

  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
  },

  sectionTitle: {
    padding: 16,
    fontWeight: '700',
    color: '#374151',
  },

  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },

  itemText: {
    color: '#1F2937', // Added explicit color for better contrast
  },

  logoutBtn: {
    marginTop: 'auto',
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
})