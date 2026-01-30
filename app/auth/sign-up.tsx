import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Animated,
  Easing,
  Alert
} from 'react-native'
import { useSignUp, useSSO, useAuth, useUser } from '@clerk/clerk-expo'
import { useRouter, Link } from 'expo-router'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'

// ✅ Consistent Import
import { generateBackendTokens } from '../api/authService'

// Required for OAuth redirects
WebBrowser.maybeCompleteAuthSession()

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const { startSSOFlow } = useSSO()
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const router = useRouter()

  /* State Types */
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [secure, setSecure] = useState<boolean>(true)
  const [code, setCode] = useState<string>('')
  const [verify, setVerify] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  /* Animations */
  const scaleAnim = useRef(new Animated.Value(0.85)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  /* Redirect if already signed in */
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      console.log('✅ User already signed in, redirecting to home...')
      router.replace('/home')
    }
  }, [isLoaded, isSignedIn])

  useEffect(() => {
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

  /* VALIDATION */
  const validate = (): boolean => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill all details')
      return false
    }
    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Enter a valid email address')
      return false
    }
    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters')
      return false
    }
    return true
  }

  /* EMAIL SIGN UP */
  const onSignUp = async () => {
    if (!validate()) return

    try {
      setLoading(true)

      await signUp.create({
        emailAddress: email,
        password,
      })

      await signUp.update({
        firstName,
        lastName,
      })

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      })

      setVerify(true)
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Sign up failed'
      Alert.alert('Error', msg)
    } finally {
      setLoading(false)
    }
  }

  /* VERIFY EMAIL */
  const onVerify = async () => {
    if (!code) {
      Alert.alert('Enter Code', 'Please enter verification code')
      return
    }

    try {
      setLoading(true)

      const res = await signUp.attemptEmailAddressVerification({ code })

      if (res.status === 'complete') {
        if (res.createdSessionId) {
          await setActive({ session: res.createdSessionId })
          
          // ✅ FIX: Use 'createdUserId' directly. 
          // 'userData' does not exist on SignUpResource.
          const userId = res.createdUserId;
          
          if (userId) {
            await generateBackendTokens(userId)
          }

          // Redirect to post-sign-in to be safe
          router.replace('/auth/post-sign-in')
        }
      } else {
        Alert.alert('Verification Incomplete', 'Please check your code')
      }
    } catch (err: any) {
      console.log('Verify Error:', err)
      Alert.alert('Verification Failed', err.errors?.[0]?.message || 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  /* GOOGLE SIGN UP */
  const onGoogle = async () => {
    try {
      setLoading(true)

      const redirectUrl = Linking.createURL('/home', { scheme: 'ziptron' })

      const { createdSessionId, setActive: setSSOActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      })

      if (createdSessionId && setSSOActive) {
        await setSSOActive({ session: createdSessionId })

        // ⏳ Wait for user data to hydrate
        await new Promise((resolve) => setTimeout(resolve, 500))

        const clerkUserId = user?.id 
        if (clerkUserId) {
           await generateBackendTokens(clerkUserId)
        }

        router.replace('/auth/post-sign-in')
      }
    } catch (err) {
      console.log('Google Sign Up Error:', err)
      Alert.alert('Google Sign Up Failed', 'Try again')
    } finally {
      setLoading(false)
    }
  }

  /* VERIFY SCREEN UI */
  if (verify) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Verify Email</Text>

          <TextInput
            placeholder="Verification code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          <TouchableOpacity style={styles.primaryBtn} onPress={onVerify}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryText}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  /* SIGN UP UI */
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraScrollHeight={140}
      contentContainerStyle={styles.container}
    >
      <Animated.View style={[styles.imageWrapper, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.glow} />
        <Image source={require('../../assets/charging.png')} style={styles.image} />
      </Animated.View>

      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />

        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />

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

        <TouchableOpacity style={styles.primaryBtn} onPress={onSignUp}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryText}>Continue</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>OR</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.googleBtn} onPress={onGoogle}>
          <Image source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }} style={styles.googleIcon} />
          <Text style={styles.googleText}>Sign up with Google</Text>
        </TouchableOpacity>

        <Link href="/auth/sign-in" style={styles.link}>
          Already have an account? Sign in
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
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 24, elevation: 6 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 16, color: '#1F2937' },
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