import { isServer } from '@builder.io/qwik/build';
import type { FirebaseApp } from 'firebase/app';

let firebaseApp: FirebaseApp | undefined;

export async function initializeFirebase() {
  if (isServer) {
    console.warn('Firebase should not be used on the server side.');
    return null;
  }

  if (!firebaseApp) {
    const { initializeApp } = await import('firebase/app');
    const firebaseConfig = {
      // Your Firebase configuration object
    };
    firebaseApp = initializeApp(firebaseConfig);
  }

  return firebaseApp;
}

export async function getAuth() {
  if (isServer) {
    console.warn('Firebase Auth should not be used on the server side.');
    return null;
  }

  const app = await initializeFirebase();
  if (!app) return null;

  const { getAuth } = await import('firebase/auth');
  return getAuth(app);
}