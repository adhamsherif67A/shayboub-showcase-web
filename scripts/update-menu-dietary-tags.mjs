import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

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

// Add dietary tags based on item names/characteristics
const addDietaryTags = (item) => {
  const name = item.name.toLowerCase();
  const description = item.description?.toLowerCase() || '';
  const category = item.category?.toLowerCase() || '';
  
  const dietaryTags = [];
  
  // Vegan items (no animal products)
  if (name.includes('espresso') || name.includes('americano') || 
      name.includes('black tea') || name.includes('green tea') ||
      name.includes('mint tea') || name.includes('hibiscus') ||
      name.includes('black coffee') || name.includes('drip coffee') ||
      (name.includes('cold brew') && !name.includes('cream') && !name.includes('milk')) ||
      category.includes('tea') || 
      (category.includes('coffee') && !name.includes('latte') && !name.includes('cappuccino') && !name.includes('mocha'))) {
    dietaryTags.push('vegan');
  }
  
  // Vegetarian items (includes dairy/eggs)
  if (name.includes('latte') || name.includes('cappuccino') || 
      name.includes('mocha') || name.includes('hot chocolate') ||
      name.includes('cheese') || name.includes('eggs') ||
      name.includes('croissant') || name.includes('muffin') ||
      name.includes('cookie') || name.includes('cake') ||
      name.includes('sandwich') || name.includes('toast') ||
      name.includes('pancake') || name.includes('waffle')) {
    dietaryTags.push('vegetarian');
  }
  
  // Gluten-free items (naturally gluten-free or specified)
  if (name.includes('salad') || name.includes('fruit') ||
      name.includes('yogurt') || name.includes('smoothie') ||
      category.includes('tea') || category.includes('coffee') ||
      name.includes('juice') || name.includes('milk') ||
      name.includes('gluten-free') || name.includes('gf')) {
    dietaryTags.push('glutenFree');
  }
  
  // Dairy-free items
  if (name.includes('oat milk') || name.includes('almond milk') ||
      name.includes('soy milk') || name.includes('coconut milk') ||
      name.includes('dairy-free') || name.includes('plant milk') ||
      (category.includes('tea') && !name.includes('milk')) ||
      (category.includes('coffee') && name.includes('black'))) {
    dietaryTags.push('dairyFree');
  }
  
  // Sugar-free items
  if (name.includes('unsweetened') || name.includes('sugar-free') ||
      name.includes('diet') || name.includes('zero sugar') ||
      (category.includes('tea') && !name.includes('sweet') && !name.includes('honey'))) {
    dietaryTags.push('sugarFree');
  }
  
  // Add existing tags if any
  if (item.tags && Array.isArray(item.tags)) {
    dietaryTags.push(...item.tags);
  }
  
  // Remove duplicates
  return [...new Set(dietaryTags)];
};

const updateMenuItems = async () => {
  try {
    console.log('🔄 Fetching menu items...');
    const snapshot = await getDocs(collection(db, "menu"));
    
    if (snapshot.empty) {
      console.log('❌ No menu items found in Firestore');
      return;
    }
    
    console.log(`📋 Found ${snapshot.size} menu items to update`);
    let updatedCount = 0;
    
    for (const docSnap of snapshot.docs) {
      const item = docSnap.data();
      const updatedTags = addDietaryTags(item);
      
      await updateDoc(doc(db, "menu", docSnap.id), {
        tags: updatedTags
      });
      
      updatedCount++;
      console.log(`✅ Updated "${item.name}" - Tags: [${updatedTags.join(', ')}]`);
    }
    
    console.log(`🎉 Successfully updated ${updatedCount} menu items with dietary tags!`);
    
  } catch (error) {
    console.error('❌ Error updating menu items:', error);
  } finally {
    process.exit(0);
  }
};

updateMenuItems();