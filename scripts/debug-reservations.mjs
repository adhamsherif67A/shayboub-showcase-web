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

const checkReservations = async () => {
  try {
    console.log('🔍 Checking reservations...');
    const snapshot = await getDocs(collection(db, "reservations"));
    
    if (snapshot.empty) {
      console.log('❌ No reservations found');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    console.log(`📅 Today's date: ${today}`);
    console.log(`📋 Total reservations: ${snapshot.size}`);
    
    const reservations = [];
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      reservations.push({
        id: doc.id,
        name: data.name,
        date: data.date,
        status: data.status,
        totalAmount: data.totalAmount,
        orderItems: data.orderItems,
        hasPreOrder: !!data.orderItems,
      });
    });
    
    console.log('\n📊 Reservations breakdown:');
    reservations.forEach((r, i) => {
      console.log(`${i + 1}. ${r.name}`);
      console.log(`   Date: ${r.date} (Today: ${r.date === today ? 'YES' : 'NO'})`);
      console.log(`   Status: ${r.status}`);
      console.log(`   Total Amount: ${r.totalAmount || 'NOT SET'}`);
      console.log(`   Has Pre-order: ${r.hasPreOrder ? 'YES' : 'NO'}`);
      console.log(`   Pre-order Items: ${r.orderItems || 'None'}`);
      console.log('');
    });
    
    // Calculate expected revenue
    const todaysConfirmedWithAmount = reservations.filter(r => 
      r.date === today && 
      r.status === "confirmed" && 
      r.totalAmount && 
      r.totalAmount > 0
    );
    
    const expectedRevenue = todaysConfirmedWithAmount.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    
    console.log('\n💰 Revenue calculation:');
    console.log(`Today's confirmed reservations: ${reservations.filter(r => r.date === today && r.status === "confirmed").length}`);
    console.log(`Today's confirmed with amount > 0: ${todaysConfirmedWithAmount.length}`);
    console.log(`Expected daily revenue: ${expectedRevenue.toFixed(2)} EGP`);
    
    if (todaysConfirmedWithAmount.length > 0) {
      console.log('\n📋 Contributing to revenue:');
      todaysConfirmedWithAmount.forEach(r => {
        console.log(`- ${r.name}: ${r.totalAmount.toFixed(2)} EGP`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking reservations:', error);
  } finally {
    process.exit(0);
  }
};

checkReservations();