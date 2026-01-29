import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated, Easing } from 'react-native'

export default function Splash() {
  // Types are inferred automatically for Animated.Value
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const glowAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Scale + fade (native driver SAFE)
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start()

    // Glow pulse (JS driver ONLY because textShadowRadius isn't supported by native driver)
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: false,
        }),
      ])
    )

    glowLoop.start()

    // ✅ IMPORTANT: cleanup to prevent crash
    return () => {
      glowLoop.stop()
    }
  }, [])

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.9],
  })

  return (
    <View style={styles.container}>
      {/* Glow layer (NOT native animated) */}
      <Animated.Text
        style={[
          styles.glowText,
          {
            opacity: glowOpacity,
          },
        ]}
      >
        ZIPTRON
      </Animated.Text>

      {/* Main logo (native animated) */}
      <Animated.Text
        style={[
          styles.logo,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        ZIPTRON
      </Animated.Text>

      <Animated.Text style={[styles.tagline, { opacity: opacityAnim }]}>
        Powering Clean Mobility
      </Animated.Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022C22', // dark green
    justifyContent: 'center',
    alignItems: 'center',
  },

  glowText: {
    position: 'absolute',
    fontSize: 46,
    fontWeight: '500',
    letterSpacing: 4,
    color: '#22C55E',
    textShadowColor: '#22C55E',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },

  logo: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 4,
    color: '#D1FAE5',
  },

  tagline: {
    marginTop: 14,
    fontSize: 14,
    letterSpacing: 1.6,
    color: '#86EFAC',
  },
})