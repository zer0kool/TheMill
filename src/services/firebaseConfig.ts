import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAoDkbkk_OX2EDhVAW1P3uJRlAnXxuP68A",
  authDomain: "restaurant-menu-demo-56278.firebaseapp.com",
  projectId: "restaurant-menu-demo-56278",
  storageBucket: "restaurant-menu-demo-56278.appspot.com",
  messagingSenderId: "487152855429",
  appId: "1:487152855429:web:3ed4426288e8a0d7fcfcec",
  measurementId: "G-351P610K5J"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = typeof window !== 'undefined' ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

export { app, auth, db };

