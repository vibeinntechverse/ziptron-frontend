import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ListRenderItem,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
// Ensure this path matches where your store is located
import { useVehicleStore } from '../store/useVehicleStore'

// 1. Define the shape of the static vehicle list items
interface VehicleOption {
  id: string;
  name: string;
}

const VEHICLES: VehicleOption[] = [
  { id: '1', name: 'Tata Nexon EV' },
  { id: '2', name: 'Tata Xpres-T EV' },
  { id: '3', name: 'MG ZS EV' },
  { id: '4', name: 'Hyundai Kona Electric' },
  { id: '5', name: 'Mahindra e2oPlus' },
]

export default function AddVehicle() {
  const router = useRouter()
  // TS typically infers the type from the store definition
  const addVehicle = useVehicleStore((s) => s.addVehicle)

  // 2. Type the state variables
  const [selected, setSelected] = useState<VehicleOption | null>(null)
  const [number, setNumber] = useState<string>('')

  const canProceed = selected && number.trim().length >= 6

  const handleAddVehicle = () => {
    if (!selected) return

    addVehicle({
      id: Date.now().toString(),
      name: selected.name,
      number: number.trim(),
      // 'require' returns a number (asset ID) or object, standard in RN
      image: require('../../assets/charging.png'), 
    })

    router.replace('/home')
  }

  // 3. Type the render item function
  const renderItem: ListRenderItem<VehicleOption> = ({ item }) => {
    const active = selected?.id === item.id

    return (
      <TouchableOpacity
        style={[
          styles.card,
          active && styles.activeCard,
        ]}
        onPress={() => setSelected(item)}
        activeOpacity={0.85}
      >
        {/* Image from backend later */}
        <View style={styles.imagePlaceholder} />
        <Text style={styles.carName}>
          {item.name}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* HEADER */}
          <Text style={styles.title}>Add Vehicle</Text>
          <Text style={styles.sub}>
            Select your EV model
          </Text>

          {/* VEHICLE GRID */}
          <FlatList
            data={VEHICLES}
            numColumns={2}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 220 }}
            renderItem={renderItem}
          />

          {/* VEHICLE NUMBER */}
          {selected && (
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Vehicle Number (DL01AB1234)"
                value={number}
                onChangeText={setNumber}
                autoCapitalize="characters"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          {/* PRIMARY ACTION */}
          <TouchableOpacity
            style={[
              styles.addBtn,
              !canProceed && { opacity: 0.5 },
            ]}
            disabled={!canProceed}
            onPress={handleAddVehicle}
            activeOpacity={0.85}
          >
            <Text style={styles.addText}>
              {canProceed
                ? `Add ${selected?.name}`
                : 'Select Vehicle'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    color: '#1F2937',
  },

  sub: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },

  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  activeCard: {
    borderColor: '#22C55E',
    backgroundColor: '#ECFDF5',
  },

  imagePlaceholder: {
    height: 80,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },

  carName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },

  inputWrapper: {
    position: 'absolute',
    bottom: 96,
    left: 16,
    right: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#fff',
    color: '#1F2937',
  },

  addBtn: {
    position: 'absolute',
    bottom: 24,
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
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
})