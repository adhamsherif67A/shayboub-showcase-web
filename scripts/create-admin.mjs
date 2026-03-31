// Run this script once to create the first admin user
// Usage: node scripts/create-admin.mjs

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdmin() {
  const email = "admin@shayboub.com";
  const password = "fwa12345678910";
  const name = "Admin";

  try {
    console.log("Creating admin user...");
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("✓ Auth user created:", userCredential.user.uid);

    // Create user document in Firestore
    await addDoc(collection(db, "users"), {
      uid: userCredential.user.uid,
      email: email,
      name: name,
      role: "admin",
      createdAt: new Date()
    });
    console.log("✓ Firestore user document created");

    console.log("\n========================================");
    console.log("Admin user created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("========================================\n");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdmin();
