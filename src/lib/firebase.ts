import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration with fallbacks for production
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDz9o9H_qZZkGVemRjXW2pxveg92GGKOFk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "shayboub-fe763.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "shayboub-fe763",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "shayboub-fe763.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "4502293021",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:4502293021:web:8ce3750dfb96d903cfd4f4",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-SNCD7532VL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
