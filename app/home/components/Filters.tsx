import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

const filters: string[] = ['All', 'Fast', 'Available', 'Offers']

export default function Filters() {
  return (
    <View style={styles.container}>
      {filters.map((item) => (
        <TouchableOpacity key={item} style={styles.chip}>
          <Text style={styles.text}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    elevation: 2,
    shadowColor: '#000', // Added shadow for iOS parity with Android elevation
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333', // Explicit color is usually safer in TS/RN defaults
  },
})