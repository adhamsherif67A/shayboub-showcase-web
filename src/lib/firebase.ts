import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDz9o9H_qZZkGVemRjXW2pxveg92GGKOFk",
  authDomain: "shayboub-fe763.firebaseapp.com",
  projectId: "shayboub-fe763",
  storageBucket: "shayboub-fe763.firebasestorage.app",
  messagingSenderId: "4502293021",
  appId: "1:4502293021:web:8ce3750dfb96d903cfd4f4",
  measurementId: "G-SNCD7532VL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
