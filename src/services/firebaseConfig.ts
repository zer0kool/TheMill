import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAoDkbkk_OX2EDhVAW1P3uJRlAnXxuP68A",
  authDomain: "restaurant-menu-demo-56278.firebaseapp.com",
  projectId: "restaurant-menu-demo-56278",
  storageBucket: "restaurant-menu-demo-56278.appspot.com",
  messagingSenderId: "487152855429",
  appId: "1:487152855429:web:3ed4426288e8a0d7fcfcec",
  measurementId: "G-351P610K5J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistence to local
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistence set to local');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

export { auth };
export const db = getFirestore(app);

