import React from 'react'
import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import * as SecureStore from 'expo-secure-store'

// 1. Define the Token Cache manually to ensure Type Safety
const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key)
    } catch (err) {
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey="pk_test_bW92aW5nLXJheS02My5jbGVyay5hY2NvdW50cy5kZXYk"
      tokenCache={tokenCache}
    >
      <Slot />
    </ClerkProvider>
  )
}