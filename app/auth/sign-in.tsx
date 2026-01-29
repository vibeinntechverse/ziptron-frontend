import React, { useState, useEffect, useRef } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, Animated, Easing, ActivityIndicator, Alert
} from 'react-native'
import { useSignIn, useSSO, useAuth, useUser } from '@clerk/clerk-expo'
import { useRouter, Link } from 'expo-router'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'

// ✅ Correct Import (ensure authService.ts exists)
import { generateBackendTokens } from '../api/authService'

// Required for OAuth redirects
WebBrowser.maybeCompleteAuthSession()

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const { startSSOFlow } = useSSO()
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const router = useRouter()

  // ✅ Added Types for State
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [secure, setSecure] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  /* Animation Refs */
  const scaleAnim = useRef(new Animated.Value(0.85)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Start Animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1, duration: 900, easing: Easing.out(Easing.exp), useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 1, duration: 900, useNativeDriver: true
      }),
    ]).start()
  }, [])

  if (!isLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    )
  }

  /* EMAIL SIGN IN */
  const onSignIn = async () => {
    if (!email || !password) return setError('Please fill all fields')

    try {
      setLoading(true)
      setError('')

      const res = await signIn.create({ identifier: email, password })

      if (res.status === 'complete') {
        // TypeScript check: Ensure createdSessionId exists
        if (res.createdSessionId) {
          await setActive({ session: res.createdSessionId })
          
          // 🔐 Generate Backend Tokens
          // Fix: createdUserId doesn't exist on SignInResource.
          // Access 'id' from userData by casting to any to bypass strict type check.
          const userId = (res.userData as any)?.id;
          
          if (userId) {
             await generateBackendTokens(userId)
          }

          // Redirect to the loading page to ensure tokens are ready
          router.replace('/auth/post-sign-in')
        }
      } else {
        console.log('Sign in not complete', res.status)
        // Handle other statuses like 'needs_factor_two' if necessary
      }
    } catch (err: any) { // ✅ Typed error as 'any' to access .errors property
      console.error('Login error:', err)
      setError(err.errors?.[0]?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  /* GOOGLE SIGN IN */
  const onGoogle = async () => {
    try {
      setLoading(true)
      setError('')

      // 🔗 Deep Link
      const redirectUrl = Linking.createURL('/home', { scheme: 'ziptron' })

      const { createdSessionId, setActive: setSSOActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      })

      if (createdSessionId && setSSOActive) {
        await setSSOActive({ session: createdSessionId })

        // ⏳ Wait for user data to propagate
        await new Promise((resolve) => setTimeout(resolve, 500))

        // 🔐 Generate Backend Tokens
        // user object might still be stale, check properly
        const clerkUserId = user?.id 
        
        if (clerkUserId) {
           await generateBackendTokens(clerkUserId)
        } else {
           console.log("User ID not immediately available, redirection will handle it...")
        }

        // Consistent redirection
        router.replace('/auth/post-sign-in')
      }
    } catch (err: any) {
      console.error('OAuth error:', err)
      // Check for specific cancellation errors if needed
      setError('Google sign in cancelled')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraScrollHeight={140}
      contentContainerStyle={styles.container}
    >
      <Animated.View style={[styles.imageWrapper, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.glow} />
        {/* Ensure this image exists in your assets folder */}
        <Image source={require('../../assets/charging.png')} style={styles.image} />
      </Animated.View>

      <View style={styles.card}>
        <Text style={styles.title}>Welcome to Ziptron</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />

        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Password"
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Text style={styles.toggle}>{secure ? 'Show' : 'Hide'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={onSignIn} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Continue</Text>}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>OR</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.googleBtn} onPress={onGoogle}>
          <Image source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }} style={styles.googleIcon} />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        <Link href="/auth/sign-up" style={styles.link}>
          Create a new account
        </Link>
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flexGrow: 1, backgroundColor: '#F4F7FB', padding: 20, justifyContent: 'center' },
  imageWrapper: { alignSelf: 'center', marginBottom: 24, width: 180, height: 180, borderRadius: 90, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ECFDF5' },
  image: { width: 150, height: 150, borderRadius: 75 },
  glow: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: '#22C55E', opacity: 0.15 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 24, elevation: 6 },
  title: { fontSize: 26, fontWeight: '700', color: '#1F2937' },
  subtitle: { color: '#6B7280', marginBottom: 16 },
  error: { color: 'red', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 14, marginBottom: 12, color: '#1F2937' },
  passwordBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 14, marginBottom: 12 },
  passwordInput: { flex: 1, paddingVertical: 14, color: '#1F2937' },
  toggle: { color: '#22C55E', fontWeight: '600' },
  primaryBtn: { backgroundColor: '#22C55E', padding: 14, borderRadius: 10, marginTop: 6 },
  primaryText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  line: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  or: { marginHorizontal: 10, color: '#6B7280' },
  googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E7EB', padding: 14, borderRadius: 10 },
  googleIcon: { width: 20, height: 20, marginRight: 8 },
  googleText: { fontWeight: '600', color: '#1F2937' },
  link: { marginTop: 16, textAlign: 'center', color: '#22C55E', fontWeight: '600' },
})