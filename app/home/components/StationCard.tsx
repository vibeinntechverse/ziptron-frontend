import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export default function StationCard() {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>Statiq DLF Building 14</Text>
        <Text style={styles.address}>2 km away • Sector 26</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.available}>⚡ Available in 19 mins</Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 6,
    shadowColor: '#000', // Added for iOS shadow support
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937', // Explicit text color
  },
  address: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  available: {
    color: '#10B981',
    fontWeight: '600',
  },
  btn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
})