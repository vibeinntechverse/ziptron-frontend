import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  ImageSourcePropType,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ListRenderItem,
  ViewToken
} from 'react-native'
import Slide from './Slide'

const { width } = Dimensions.get('window')

// 1. Define the interface for a single Slide item
export interface SlideData {
  id: string;
  title: string;
  desc: string;
  image: ImageSourcePropType;
}

// 2. Define the interface for Component Props
interface OnboardingProps {
  onFinish: () => void;
}

const slides: SlideData[] = [
  {
    id: '1',
    title: 'Discover',
    desc: 'Find nearby EV charging stations instantly.',
    image: require('../../assets/Discover.png'),
  },
  {
    id: '2',
    title: 'Charge',
    desc: 'Track charging progress in real time.',
    image: require('../../assets/logo.png'),
  },
  {
    id: '3',
    title: 'Pay',
    desc: 'Fast, secure & hassle-free payments.',
    image: require('../../assets/logo.png'),
  },
]

export default function Onboarding({ onFinish }: OnboardingProps) {
  // 3. Type the useRef for FlatList (generic with your data type)
  const flatListRef = useRef<FlatList<SlideData>>(null)
  
  // 4. Type the state
  const [index, setIndex] = useState<number>(0)

  /* 🔁 Auto slide */
  useEffect(() => {
    const interval = setInterval(() => {
      // Check if we are not at the last slide
      if (index < slides.length - 1) {
        flatListRef.current?.scrollToIndex({ index: index + 1 })
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [index])

  // 5. Type the Scroll Event
  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    setIndex(newIndex);
  }

  // 6. Type the Render Item function
  const renderItem: ListRenderItem<SlideData> = ({ item }) => <Slide item={item} />

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        // Use generic event type if needed, or the specific handler
        onMomentumScrollEnd={handleScrollEnd}
        // Optimization props
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* 🔵 DOT INDICATORS */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              index === i && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* ✅ GET STARTED BUTTON (ONLY ON LAST SLIDE) */}
      {index === slides.length - 1 && (
        <TouchableOpacity style={styles.btn} onPress={onFinish}>
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021a15',
  },
  dots: {
    position: 'absolute',
    bottom: 140,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#22C55E',
    width: 12,
  },
  btn: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: '#22C55E',
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 30,
  },
  btnText: {
    color: '#022C22',
    fontWeight: '700',
    fontSize: 16,
  },
})