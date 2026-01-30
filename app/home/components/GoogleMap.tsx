import React, { useRef, useEffect, useCallback } from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE, LatLng } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

const { width, height } = Dimensions.get('window')

// 1. Define the shape of a Station object
interface Station {
  id: string | number;
  name: string;
  address?: string;
  lat: number | string;
  lng: number | string;
  latitude?: number | string; // Handle both cases for safety
  longitude?: number | string;
}

// 2. Define the shape of Location data
interface LocationData {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
}

// 3. Define the Component Props
interface GoogleMapProps {
  userLocation: LocationData | null;
  destination: LocationData | null;
  stations?: Station[];
}

const GoogleMapComponent = ({ 
  userLocation, 
  destination, 
  stations = [] 
}: GoogleMapProps) => {
  // 4. Type the Ref correctly
  const mapRef = useRef<MapView | null>(null)

  // 🔄 Auto-zoom to fit both User and Destination when a route is found
  useEffect(() => {
    if (userLocation && destination && mapRef.current) {
      mapRef.current.fitToCoordinates([userLocation, destination], {
        edgePadding: { top: 100, right: 50, bottom: 50, left: 50 },
        animated: true,
      })
    }
  }, [destination, userLocation])

  // Memoize callbacks
  const handleDirectionsReady = useCallback((result: any) => {
    console.log(`Distance: ${result.distance} km`)
    console.log(`Duration: ${result.duration} min`)
  }, [])

  const handleDirectionsError = useCallback((errorMessage: string) => {
    console.error('Routing Error:', errorMessage)
  }, [])

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={{
          latitude: userLocation?.latitude || 28.6139,
          longitude: userLocation?.longitude || 77.2090,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* 📍 Render Charging Stations */}
        {stations?.map((station) => {
          // Safety check for coordinates
          const lat = Number(station.lat || station.latitude);
          const lng = Number(station.lng || station.longitude);

          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker
              key={station.id}
              coordinate={{
                latitude: lat,
                longitude: lng,
              }}
              title={station.name}
              pinColor="#22C55E" // Green for stations
            />
          )
        })}

        {/* 🏁 Destination Marker (Only if searched) */}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            pinColor="red"
          />
        )}

        {/* 🛣️ The Route Line */}
        {userLocation && destination && (
          <MapViewDirections
            origin={userLocation}
            destination={destination}
            // Force string type for API key (TS might think it's undefined)
            apikey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string}
            strokeWidth={4}
            strokeColor="#3b82f6" // Blue route line
            optimizeWaypoints={true}
            onReady={handleDirectionsReady}
            onError={handleDirectionsError}
          />
        )}
      </MapView>
    </View>
  )
}

// Export memoized component to prevent unnecessary re-renders
export default React.memo(GoogleMapComponent)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: width,
    height: height,
  },
})