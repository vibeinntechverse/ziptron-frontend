import React from 'react'
import { View, StyleSheet } from 'react-native'
import { GooglePlacesAutocomplete, GooglePlaceDetail, GooglePlaceData } from 'react-native-google-places-autocomplete'

// 1. Define the structure of the location object you pass back
export interface SearchLocation {
  latitude: number;
  longitude: number;
  title: string;
}

// 2. Define the Props interface
interface SearchBarProps {
  onLocationSelect: (location: SearchLocation) => void;
}

export default function SearchBar({ onLocationSelect }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search for a location..."
        fetchDetails={true}
        enablePoweredByContainer={false}
        onPress={(data: GooglePlaceData, details: GooglePlaceDetail | null = null) => {
          if (!details) return

          const destination: SearchLocation = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            title: data.description,
          }

          onLocationSelect(destination)
        }}
        query={{
          // Ensure TS treats this as a string
          key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string, 
          language: 'en',
          components: 'country:in',
        }}
        styles={{
          container: {
            flex: 0,
          },
          textInputContainer: styles.inputContainer,
          textInput: styles.input,
          listView: styles.listView,
          row: styles.row,
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    width: '90%',
    alignSelf: 'center',
    zIndex: 100,
  },
  inputContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    color: '#000', // Explicit text color
  },
  listView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 8,
    elevation: 5,
    zIndex: 1000,
  },
  row: {
    padding: 13,
    height: 44,
    flexDirection: 'row',
  },
})