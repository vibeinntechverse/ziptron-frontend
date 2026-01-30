import React, { useEffect, useState, useCallback } from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Text, ImageSourcePropType } from 'react-native'
import { useRouter } from 'expo-router'
import * as Location from 'expo-location'

// Components
import Header from './components/Header'
import SearchBar, { SearchLocation } from './components/SearchBar'
import Filters from './components/Filters'
import StationCard from './components/StationCard'
import VehicleBottomSheet, { Vehicle } from './components/VehicleBottomSheet'
import GoogleMap from './components/GoogleMap'
import { useVehicleStore } from '../store/useVehicleStore' 

// 1. Define Interfaces
interface LocationData {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
}

interface Station {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export default function Home() {
  const router = useRouter()

  // Use Zustand store with separate selectors to avoid infinite loop
  const selectedVehicle = useVehicleStore((state) => state.selectedVehicle)
  const vehicles = useVehicleStore((state) => state.vehicles)
  
  // 2. Type the State
  const [sheetOpen, setSheetOpen] = useState<boolean>(false)
  
  // 📍 Map State
  const [userLocation, setUserLocation] = useState<LocationData | null>(null)
  const [destination, setDestination] = useState<LocationData | null>(null)
  const [stations, setStations] = useState<Station[]>([])

  /* 🔐 1. CHECK VEHICLE ON LOAD */
  useEffect(() => {
    if (vehicles.length === 0) {
      router.replace('/home/add-vehicle')
    }
  }, [vehicles.length, router])

  /* 📍 2. GET USER LOCATION */
  useEffect(() => {
    let isMounted = true
    
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted' || !isMounted) return

      const loc = await Location.getCurrentPositionAsync({})
      if (isMounted) {
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        })
      }
    })()
    
    return () => {
      isMounted = false
    }
  }, [])

  /* ⚡ 3. LOAD DUMMY STATIONS */
  useEffect(() => {
    setStations([
      { id: '1', name: 'Tata Power EZ Charge', address: 'Connaught Place, Delhi', lat: 28.6304, lng: 77.2177 },
      { id: '2', name: 'Statiq Charging Station', address: 'Janpath Road, Delhi', lat: 28.6129, lng: 77.2295 },
      { id: '3', name: 'BluSmart Hub', address: 'Aerocity, Delhi', lat: 28.5562, lng: 77.1000 },
    ])
  }, [])

  // Memoize callbacks to prevent unnecessary re-renders
  const handleLocationSelect = useCallback((loc: SearchLocation) => {
    setDestination({
      latitude: loc.latitude,
      longitude: loc.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    })
  }, [])

  const handleVehicleApply = useCallback((v: Vehicle) => {
    useVehicleStore.getState().selectVehicle(v)
    setSheetOpen(false)
  }, [])

  const handleAddNew = useCallback(() => {
    setSheetOpen(false)
    router.push('/home/add-vehicle')
  }, [router])

  if (!selectedVehicle) return null

  return (
    <View style={styles.container}>
      {/* HEADER & SEARCH */}
      <Header vehicle={selectedVehicle} />
      
      {/* 🔍 Search Bar updates 'destination' */}
      <SearchBar onLocationSelect={handleLocationSelect} />

      <Filters />

      {/* 🚗 Vehicle Quick Switcher */}
      <TouchableOpacity
        style={styles.vehicleWrapper}
        onPress={() => setSheetOpen(true)}
      >
        <Image
          source={require('../../assets/charging.png')}
          style={styles.vehicleImage}
        />
        <Text style={styles.vehicleText}>{selectedVehicle.name}</Text>
      </TouchableOpacity>

      {/* 🗺️ MAP */}
      <View style={styles.mapContainer}>
        <GoogleMap 
          userLocation={userLocation} 
          destination={destination} 
          stations={stations} 
        />
      </View>

      {/* BOTTOM INFO CARD */}
      {!destination && <StationCard />}

      {/* BOTTOM SHEET */}
      <VehicleBottomSheet
        visible={sheetOpen}
        vehicles={vehicles}
        onClose={() => setSheetOpen(false)}
        onAddNew={handleAddNew}
        onApply={handleVehicleApply}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  vehicleWrapper: {
    position: 'absolute',
    top: 110,
    left: 16,
    zIndex: 20,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  vehicleImage: { width: 60, height: 30, resizeMode: 'contain' },
  vehicleText: { marginTop: 2, fontSize: 10, fontWeight: '700', color: '#374151' },

  mapContainer: { 
    flex: 1,
    marginTop: -20, 
  },
})