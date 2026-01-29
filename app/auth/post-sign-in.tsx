import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { generateBackendTokens } from '../api/authService';

export default function PostSignIn() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const processTokens = async () => {
      // 1. Wait until Clerk has fully loaded the user data
      if (!authLoaded || !userLoaded) return;

      // 2. If for some reason they aren't signed in, send them back to login
      if (!isSignedIn) {
        router.replace('/auth/sign-in');
        return;
      }

      // 3. TypeScript Safety Check: Ensure user object exists
      if (!user) {
        router.replace('/auth/sign-in');
        return;
      }

      try {
        // 4. Call your backend token generation
        // user.id is now guaranteed to be a string
        await generateBackendTokens(user.id);
        
        // 5. Success! Now go to the home page
        router.replace('/home');
      } catch (error) {
        console.error("Post-Sign-In Token Error:", error);
        // If backend fails, you might want to alert the user or logout
        router.replace('/auth/sign-in');
      }
    };

    processTokens();
  }, [authLoaded, userLoaded, isSignedIn, user]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#22C55E" />
      <Text style={styles.text}>Finalizing your secure session...</Text>
      <Text style={styles.subtext}>Setting up Ziptron for you</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7FB',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  subtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
  },
});