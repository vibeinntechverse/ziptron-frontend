import { Stack } from 'expo-router/stack'
import React from 'react'

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  )
}