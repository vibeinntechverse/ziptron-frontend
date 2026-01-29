import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'

// 1. Define the shape of the Vehicle object
interface Vehicle {
  name?: string;
  number?: string;
  image?: any; // Optional, included for compatibility with other components
}

// 2. Define the Props interface
interface HeaderProps {
  vehicle: Vehicle | null;
}

export default function Header({ vehicle }: HeaderProps) {
  const router = useRouter()

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.car}>
          {vehicle?.name || 'No Vehicle'}
        </Text>
        <Text style={styles.number}>
          {vehicle?.number || 'Add your vehicle'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.profile}
        // Ensure '/profile' route exists in your app folder
        onPress={() => router.push('/profile')}
      >
        <Text>👤</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F7FB',
  },
  car: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937', // Explicit text colors are better in TS
  },
  number: {
    fontSize: 12,
    color: '#6B7280',
  },
  profile: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
})