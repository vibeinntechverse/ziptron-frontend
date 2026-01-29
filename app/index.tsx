import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

import Splash from './splash'
import Onboarding from './onboarding'
import { useVehicleStore } from './store/useVehicleStore'

// 1. Define the valid stages of your app startup
type AppStage = 'splash' | 'onboarding' | 'authCheck';

export default function Entry() {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  // TypeScript infers 'vehicles' type from your store definition
  const vehicles = useVehicleStore((s) => s.vehicles)

  // 2. Apply the type to useState
  const [stage, setStage] = useState<AppStage>('splash')

  /* 🟢 Splash screen timer */
  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('onboarding')
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  /* 🔐 Auth + Vehicle Check */
  useEffect(() => {
    // Only run this logic if we are in the 'authCheck' stage
    if (stage !== 'authCheck') return
    
    // Wait for Clerk to load
    if (!isLoaded) return

    const timer = setTimeout(() => {
      if (!isSignedIn) {
        // User is not signed in -> Go to Sign In
        router.replace('/auth/sign-in')
        return
      }

      // User is signed in -> Check if they have vehicles
      if (vehicles.length === 0) {
        router.replace('/home/add-vehicle')
      } else {
        router.replace('/home')
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [stage, isLoaded, isSignedIn, vehicles])

  /* 🔵 Render stages */
  if (stage === 'splash') return <Splash />

  if (stage === 'onboarding') {
    return (
      <Onboarding
        onFinish={() => setStage('authCheck')}
      />
    )
  }

  // Loading / Auth Check State
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#22C55E" />
    </View>
  )
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: '#022C22',
    justifyContent: 'center',
    alignItems: 'center',
  },
})