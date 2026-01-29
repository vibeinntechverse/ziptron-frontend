import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ImageSourcePropType
} from 'react-native'
import { useRouter } from 'expo-router'

const { width } = Dimensions.get('window')

// 1. Define the interface for the item prop
export interface SlideItem {
  id: string;
  title: string;
  desc: string;
  image: ImageSourcePropType;
}

// 2. Define component props
interface SlideProps {
  item: SlideItem;
}

export default function Slide({ item }: SlideProps) {
  const router = useRouter()

  return (
    <ImageBackground source={item.image} style={styles.container}>
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.desc}</Text>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.replace('/auth/sign-in')}
      >
        <Text style={styles.btnText}>Getting Started</Text>
      </TouchableOpacity>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  desc: {
    color: '#E5E7EB',
    textAlign: 'center',
    fontSize: 14,
  },
  btn: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: '#22C55E',
    width: '85%',
    padding: 16,
    borderRadius: 12,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
})