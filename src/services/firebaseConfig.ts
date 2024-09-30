import { initializeApp, getApps, getApp } from "firebase/app";
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

// Initialize Firebase for both client and server
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

