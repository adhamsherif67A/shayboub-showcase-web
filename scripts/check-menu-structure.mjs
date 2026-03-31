import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxNAKFhYrRV5rqzgBgIGnAgdLNlRjfZdI",
  authDomain: "shayboub-fe763.firebaseapp.com",
  projectId: "shayboub-fe763",
  storageBucket: "shayboub-fe763.firebasestorage.app",
  messagingSenderId: "962949244421",
  appId: "1:962949244421:web:d6e5cbcc49e7e6dc0c7c90",
  measurementId: "G-EK8DQJZG0R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const checkMenuStructure = async () => {
  try {
    console.log('🔄 Fetching menu items to check structure...');
    const snapshot = await getDocs(collection(db, "menu"));
    
    if (snapshot.empty) {
      console.log('❌ No menu items found in Firestore');
      return;
    }
    
    console.log(`📋 Found ${snapshot.size} documents in menu collection`);
    
    snapshot.docs.forEach((docSnap, index) => {
      const data = docSnap.data();
      console.log(`Document ${index + 1}:`);
      console.log(`- ID: ${docSnap.id}`);
      console.log(`- Data keys:`, Object.keys(data));
      console.log(`- First few keys/values:`, JSON.stringify(data, null, 2).slice(0, 200));
      console.log('---');
    });
    
  } catch (error) {
    console.error('❌ Error checking menu structure:', error);
  } finally {
    process.exit(0);
  }
};

checkMenuStructure();