import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
  ImageSourcePropType,
  ListRenderItem
} from 'react-native'

// 1. Define the shape of a Vehicle
export interface Vehicle {
  id?: string | number;
  name: string;
  number: string;
  image: ImageSourcePropType; // Correct type for local require() images
}

// 2. Define Component Props
interface VehicleBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onApply: (vehicle: Vehicle) => void;
  onAddNew: () => void;
}

export default function VehicleBottomSheet({
  visible,
  onClose,
  vehicles = [],
  onApply,
  onAddNew,
}: VehicleBottomSheetProps) {
  // 3. Type the state
  const [selected, setSelected] = useState<Vehicle | null>(null)

  const renderItem: ListRenderItem<Vehicle> = ({ item }) => {
    const active =
      selected?.name === item.name &&
      selected?.number === item.number

    return (
      <TouchableOpacity
        style={[
          styles.card,
          active && styles.activeCard,
        ]}
        onPress={() => setSelected(item)}
      >
        <Image
          source={item.image}
          style={styles.image}
        />
        <Text style={styles.carName}>
          {item.name}
        </Text>
        <Text style={styles.number}>
          {item.number}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          <Text style={styles.title}>My Vehicles</Text>

          {/* VEHICLE LIST */}
          <FlatList
            horizontal
            data={vehicles}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) =>
              item.id?.toString() || `${item.name}-${index}`
            }
            renderItem={renderItem}
          />

          {/* ACTION BUTTONS */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={onAddNew}
            >
              <Text style={styles.addText}>Add New</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.applyBtn,
                !selected && { opacity: 0.5 },
              ]}
              disabled={!selected}
              onPress={() => selected && onApply(selected)}
            >
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handle: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 16,
    marginBottom: 12,
    color: '#1F2937',
  },
  card: {
    width: 160,
    backgroundColor: '#F9FAFB',
    marginHorizontal: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeCard: {
    borderColor: '#22C55E',
    backgroundColor: '#ECFDF5',
  },
  image: {
    width: '100%',
    height: 70,
    resizeMode: 'contain',
  },
  carName: {
    fontWeight: '600',
    marginTop: 8,
    color: '#374151',
  },
  number: {
    color: '#6B7280',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  addBtn: {
    paddingVertical: 14,
  },
  addText: {
    color: '#F97316',
    fontWeight: '700',
    fontSize: 16,
  },
  applyBtn: {
    backgroundColor: '#F97316',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  applyText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
})