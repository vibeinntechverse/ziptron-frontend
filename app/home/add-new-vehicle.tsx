import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ListRenderItem
} from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

// 1. Define the type for the static vehicle options
interface VehicleOption {
  id: string;
  name: string;
}

// 2. Define the type for the object we will save
interface SavedVehicle {
  id?: string;
  name: string;
  number: string;
  image: any; // Using 'any' is standard for require() assets in React Native
}

const VEHICLES: VehicleOption[] = [
  { id: '1', name: 'Tata Nexon EV' },
  { id: '2', name: 'Tata Xpres-T EV' },
  { id: '3', name: 'MG ZS EV' },
  { id: '4', name: 'Hyundai Kona Electric' },
]

export default function AddVehicle() {
  const router = useRouter()

  // 3. Type the state
  const [selected, setSelected] = useState<VehicleOption | null>(null)
  const [number, setNumber] = useState<string>('')

  const canSave = selected && number.length >= 6

  const saveVehicle = async () => {
    if (!selected) return

    const vehicle: SavedVehicle = {
      id: selected.id,
      name: selected.name,
      number,
      // Make sure this path is correct relative to this file
      image: require('../../assets/charging.png'),
    }

    await AsyncStorage.setItem('USER_VEHICLE', JSON.stringify(vehicle))
    router.replace('/home')
  }

  // 4. Type the renderItem function
  const renderItem: ListRenderItem<VehicleOption> = ({ item }) => {
    const active = selected?.id === item.id
    return (
      <TouchableOpacity
        style={[styles.card, active && styles.activeCard]}
        onPress={() => setSelected(item)}
        activeOpacity={0.7}
      >
        <View style={styles.imagePlaceholder} />
        <Text style={styles.carName}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Vehicle</Text>

      <FlatList
        data={VEHICLES}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <TextInput
        placeholder="Vehicle Number (DL01AB1234)"
        autoCapitalize="characters"
        value={number}
        onChangeText={setNumber}
        style={styles.input}
        placeholderTextColor="#9CA3AF"
      />

      <TouchableOpacity
        disabled={!canSave}
        style={[styles.addBtn, !canSave && { opacity: 0.5 }]}
        onPress={saveVehicle}
      >
        <Text style={styles.addText}>
          {selected
            ? `${selected.name} • ${number || '____'}`
            : 'Select Vehicle'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 22, 
    fontWeight: '700', 
    marginBottom: 16,
    color: '#1F2937' 
  },
  listContent: {
    paddingBottom: 100, // Space for bottom button
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  activeCard: {
    borderColor: '#22C55E',
    backgroundColor: '#ECFDF5',
  },
  imagePlaceholder: {
    height: 60,
    width: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    marginBottom: 12,
  },
  carName: { 
    fontWeight: '600', 
    fontSize: 13,
    color: '#374151',
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    marginBottom: 80, // Ensure input isn't hidden behind button
    color: '#1F2937',
    fontSize: 16,
  },
  addBtn: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: '#22C55E',
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
})