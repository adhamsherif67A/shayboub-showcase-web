// Import menu data to Firestore
// Usage: node scripts/import-menu.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

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
const db = getFirestore(app);

// Menu data - same as src/data/menu.ts
const menuData = [
  {
    name: "Hot Coffee",
    items: [
      { name: "Espresso", price: 60, image: "https://media.alimento.io/items/45/17315799216369701.jpg" },
      { name: "Macchiato", price: 70, image: "https://media.alimento.io/items/45/17324884267363171.jpg" },
      { name: "Americano", price: 65, image: "https://media.alimento.io/items/45/17324886679011747.jpg" },
      { name: "Cortado", price: 75, image: "https://media.alimento.io/items/45/17324108918451024.jpg" },
      { name: "Flat White", price: 80, image: "https://media.alimento.io/items/45/17315799311037167.jpg" },
      { name: "Cappuccino", price: 90, image: "https://media.alimento.io/items/45/17324884537042942.jpg" },
      { name: "Latte", price: 90, image: "https://media.alimento.io/items/45/17324884626216750.jpg" },
    ],
  },
  {
    name: "Signature Hot",
    items: [
      { name: "Spanish Latte", price: 110, image: "https://media.alimento.io/items/45/17324885781303642.jpg" },
      { name: "Pistachio Latte", price: 135, image: "https://media.alimento.io/items/45/17467469076453353.jpg" },
      { name: "Salted Caramel", price: 120, image: "https://media.alimento.io/items/45/17324885901963767.jpg" },
      { name: "Mocha", price: 110, image: "https://media.alimento.io/items/45/17324886515876576.jpg" },
      { name: "White Mocha", price: 110, image: "https://media.alimento.io/items/45/17324886597038988.jpg" },
      { name: "Spicy Cinnamon Latte", price: 125, image: "https://media.alimento.io/items/45/17324886515876576.jpg", tags: ["spicy"] },
      { name: "Salted Vanilla Latte", price: 125, image: "https://media.alimento.io/items/45/17324885781303642.jpg" },
      { name: "Spiced Banoffee", price: 125, image: "https://media.alimento.io/items/45/17324886515876576.jpg", tags: ["new"] },
      { name: "Ginger Bread", price: 125, image: "https://media.alimento.io/items/45/17324886515876576.jpg", tags: ["new"] },
    ],
  },
  {
    name: "Hot Sweet Potato",
    items: [
      { name: "Classic", price: 110, image: "https://media.alimento.io/items/45/17324886947287046.jpg", tags: ["new"] },
      { name: "Crème Brûlée", price: 130, image: "https://media.alimento.io/items/45/17324886947287046.jpg", tags: ["new"] },
      { name: "Salted Caramel", price: 120, image: "https://media.alimento.io/items/45/17324886947287046.jpg", tags: ["new"] },
      { name: "Lotus", price: 120, image: "https://media.alimento.io/items/45/17324886947287046.jpg", tags: ["new"] },
    ],
  },
  {
    name: "Hot Chocolate",
    items: [
      { name: "Signature Mellows", price: 110, image: "https://media.alimento.io/items/45/17324886947287046.jpg", tags: ["new"] },
      { name: "Strawberry", price: 125, image: "https://media.alimento.io/items/45/17324886947287046.jpg" },
      { name: "White Choco", price: 120, image: "https://media.alimento.io/items/45/17324886947287046.jpg" },
    ],
  },
  {
    name: "Ice Coffee",
    items: [
      { name: "Ice Americano", price: 75, image: "https://media.alimento.io/items/45/17467145451457878.png" },
      { name: "Ice Latte", price: 90, image: "https://media.alimento.io/items/45/17467156332166078.png" },
      { name: "Ice Spanish Latte", price: 115, image: "https://media.alimento.io/items/45/17467248442221448.jpg", tags: ["topRated"] },
      { name: "Ice White Mocha", price: 120, image: "https://media.alimento.io/items/45/17467284084465300.jpg" },
      { name: "Ice Mocha", price: 110, image: "https://media.alimento.io/items/45/17315836327986758.jpg" },
      { name: "Ice Salted Caramel", price: 135, image: "https://media.alimento.io/items/45/17467207432565675.jpg" },
      { name: "Ice Salted Vanilla", price: 120, image: "https://media.alimento.io/items/45/17467207432565675.jpg" },
      { name: "Ice Pistachio Latte", price: 145, image: "https://media.alimento.io/items/45/17467469076453353.jpg" },
      { name: "Coffee Frappe", price: 100, image: "https://media.alimento.io/items/45/17467266088164820.jpg" },
      { name: "Spicy Spanish Cinna", price: 115, image: "https://media.alimento.io/items/45/17467206802341889.jpg", tags: ["spicy"] },
      { name: "Spiced Banoffee", price: 155, image: "https://media.alimento.io/items/45/17467206802341889.jpg", tags: ["new"] },
      { name: "Ginger Bread", price: 155, image: "https://media.alimento.io/items/45/17467206802341889.jpg", tags: ["new"] },
      { name: "Cherry Vanilla", price: 155, image: "https://media.alimento.io/items/45/17467206802341889.jpg", tags: ["new"] },
    ],
  },
  {
    name: "Hojicha",
    items: [
      { name: "Hojicha Latte", price: 130, image: "https://media.alimento.io/items/45/17467147189372754.jpg", tags: ["new"] },
      { name: "White Chocolate Hojicha", price: 165, image: "https://media.alimento.io/items/45/17467147189372754.jpg", tags: ["new"] },
      { name: "Spiced Banoffee Hojicha", price: 170, image: "https://media.alimento.io/items/45/17467147189372754.jpg", tags: ["new"] },
      { name: "Cherry Hojicha", price: 140, image: "https://media.alimento.io/items/45/17467147189372754.jpg", tags: ["new"] },
      { name: "Cloud Hojicha", price: 130, image: "https://media.alimento.io/items/45/17467147189372754.jpg", tags: ["new"] },
      { name: "Blue Hojicha", price: 170, image: "https://media.alimento.io/items/45/17467147189372754.jpg", tags: ["new"] },
      { name: "Pink Hojicha", price: 170, image: "https://media.alimento.io/items/45/17467147189372754.jpg", tags: ["new"] },
    ],
  },
  {
    name: "Matcha",
    items: [
      { name: "Matcha Latte", price: 130, image: "https://media.alimento.io/items/45/17467149293283863.png" },
      { name: "Pistachio Matcha", price: 160, image: "https://media.alimento.io/items/45/17467147189372754.jpg" },
      { name: "Iced Matcha", price: 130, image: "https://media.alimento.io/items/45/17467149293283863.png" },
      { name: "Salted Caramel Matcha", price: 135, image: "https://media.alimento.io/items/45/17467488169604393.jpg" },
      { name: "Pistachio Matcha", price: 170, image: "https://media.alimento.io/items/45/17467469076453353.jpg" },
      { name: "Salted Vanilla Matcha", price: 135, image: "https://media.alimento.io/items/45/17467488169604393.jpg" },
      { name: "White Choco Matcha", price: 155, image: "https://media.alimento.io/items/45/17469225121041215.jpeg" },
      { name: "Matcha Fruit Blend", price: 140, image: "https://media.alimento.io/items/45/17467231599519767.jpg", description: "Strawberry, Coco, Blueberry, Mango, Cherry" },
      { name: "Pink Blush Matcha", price: 170, image: "https://media.alimento.io/items/45/17467231599519767.jpg", tags: ["new"] },
      { name: "Blue Breeze Matcha", price: 170, image: "https://media.alimento.io/items/45/17469225121041215.jpeg", tags: ["new"] },
      { name: "Spiced Banoffee Matcha", price: 170, image: "https://media.alimento.io/items/45/17467488169604393.jpg", tags: ["new"] },
      { name: "Ginger Bread Matcha", price: 170, image: "https://media.alimento.io/items/45/17467488169604393.jpg", tags: ["new"] },
      { name: "Matcha Birthday", price: 170, image: "https://media.alimento.io/items/45/17467488169604393.jpg", tags: ["new"] },
    ],
  },
  {
    name: "Brewing Coffee",
    items: [
      { name: "V60", price: 130, image: "https://media.alimento.io/items/45/17324887205336489.jpg" },
      { name: "Iced V60", price: 130, image: "https://media.alimento.io/items/45/17467144122866851.png" },
      { name: "Cold Brew", price: 130, image: "https://media.alimento.io/items/45/17467144312481059.png" },
    ],
  },
  {
    name: "Redbull Creations",
    items: [
      { name: "NeonBurn", price: 175, image: "https://media.alimento.io/items/45/17315824769476131.jpg", tags: ["new"] },
      { name: "SunBurn", price: 175, image: "https://media.alimento.io/items/45/17315824769476131.jpg", tags: ["new"] },
      { name: "CocoRose", price: 175, image: "https://media.alimento.io/items/45/17315824769476131.jpg", tags: ["new"] },
      { name: "BerryVanilla", price: 175, image: "https://media.alimento.io/items/45/17315824769476131.jpg", tags: ["new"] },
    ],
  },
  {
    name: "Shaky Frappe",
    items: [
      { name: "Caramel Frappe", price: 110, image: "https://media.alimento.io/items/45/17467266379891024.jpg" },
      { name: "Vanilla Frappe", price: 110, image: "https://media.alimento.io/items/45/17467468783788053.jpg" },
      { name: "Strawberry Frappe", price: 110, image: "https://media.alimento.io/items/45/17467468783788053.jpg" },
      { name: "Chocolate Frappe", price: 110, image: "https://media.alimento.io/items/45/17467467756756049.jpg" },
      { name: "Pistachio Frappe", price: 135, image: "https://media.alimento.io/items/45/17467469076453353.jpg" },
      { name: "Spiced Banoffee Frappe", price: 135, image: "https://media.alimento.io/items/45/17467266643645043.jpg", tags: ["new"] },
      { name: "Banana S Caramel Frappe", price: 135, image: "https://media.alimento.io/items/45/17467266379891024.jpg", tags: ["new"] },
    ],
  },
  {
    name: "Ice Tea",
    items: [
      { name: "Ice Tea Peach", price: 100, image: "https://media.alimento.io/items/45/17467210446570481.jpg" },
      { name: "Ice Tea Blueberry", price: 100, image: "https://media.alimento.io/items/45/17315841469717343.jpg" },
      { name: "Ice Tea Raspberry", price: 100, image: "https://media.alimento.io/items/45/17467146484248504.jpg" },
    ],
  },
  {
    name: "Classic Hot Tea",
    items: [
      { name: "Spicy Winter", price: 110, image: "https://media.alimento.io/items/45/17324110225270526.jpg", tags: ["new", "spicy"] },
      { name: "Black Tea", price: 50, image: "https://media.alimento.io/items/45/17315787535123284.jpg" },
      { name: "Green Tea Mint", price: 50, image: "https://media.alimento.io/items/45/17324110027377877.jpg" },
      { name: "Hot Cider", price: 85, image: "https://media.alimento.io/items/45/17324110404824408.jpg" },
      { name: "Lemon Ginger", price: 85, image: "https://media.alimento.io/items/45/17324110404824408.jpg" },
    ],
  },
  {
    name: "Mojito",
    items: [
      { name: "Classic Mojito", price: 130, image: "https://media.alimento.io/items/45/17315798937145075.jpg" },
      { name: "Berry Kiss", price: 130, image: "https://media.alimento.io/items/45/17467151433736698.jpg", tags: ["topRated"] },
      { name: "Blueberry Mojito", price: 130, image: "https://media.alimento.io/items/45/17315841469717343.jpg" },
      { name: "Passion Fruit Mojito", price: 130, image: "https://media.alimento.io/items/45/17467485377801354.jpg" },
      { name: "Ocean Blue Mojito", price: 130, image: "https://media.alimento.io/items/45/17467152096203019.jpg" },
      { name: "Peach Mojito", price: 130, image: "https://media.alimento.io/items/45/17467210446570481.jpg" },
      { name: "Redbull Mojito", price: 165, image: "https://media.alimento.io/items/45/17315824769476131.jpg" },
    ],
  },
  {
    name: "Smoothies",
    items: [
      { name: "Passion Smoothie", price: 130, image: "https://media.alimento.io/items/45/17467155836170700.jpg" },
      { name: "Piña Colada Smoothie", price: 130, image: "https://media.alimento.io/items/45/17467480489000391.jpg" },
      { name: "Blueberry Smoothie", price: 130, image: "https://media.alimento.io/items/45/17467150646456610.jpg" },
      { name: "Watermelon Smoothie", price: 130, image: "https://media.alimento.io/items/45/17467150383216097.jpg" },
      { name: "Peach Mango Smoothie", price: 130, image: "https://media.alimento.io/items/45/17467291857789053.jpg", tags: ["topRated"] },
    ],
  },
  {
    name: "Fresh Juice",
    items: [
      { name: "Orange", price: 90, image: "https://media.alimento.io/items/45/17467153217968669.png", tags: ["topRated"] },
      { name: "Lemon Mint", price: 95, image: "https://media.alimento.io/items/45/17440342612932340.jpg" },
      { name: "Watermelon", price: 100, image: "https://media.alimento.io/items/45/17467153554956309.jpg" },
    ],
  },
  {
    name: "Crave Club - SQR Bun",
    items: [
      { name: "Signature Smok'n Chicken", price: 170, image: "https://media.alimento.io/items/45/17315822582384749.jpg", description: "Chicken, bell pepper, lettuce, choice of sauce", tags: ["topRated"] },
      { name: "Buffalo Beef", price: 180, image: "https://media.alimento.io/items/45/17315904172207551.jpg", description: "Beef bacon, salami, buffalo sauce, cheddar, mayo, tomato, pickles, lettuce" },
      { name: "The Caesar", price: 190, image: "https://media.alimento.io/items/45/17315794748044240.jpg", description: "Smoked chicken, parmesan, caesar sauce, lettuce" },
      { name: "Mix Cheese", price: 140, image: "https://media.alimento.io/items/45/17315813311550788.jpg", description: "Cheddar, mozzarella, emmental, lettuce, mixed sauce" },
      { name: "Smok'n Turkey", price: 150, image: "https://media.alimento.io/items/45/17315903775391463.jpg", description: "Smoked turkey, cheddar, mixed sauce, lettuce" },
      { name: "Chick'n Pesto", price: 190, image: "https://media.alimento.io/items/45/17315794525951603.jpg", description: "Chicken smoked/grilled, pesto sauce, parmesan, sundried tomato, lettuce" },
    ],
  },
  {
    name: "Crave Club - Sourdough",
    items: [
      { name: "Roast Beef", price: 180, image: "https://media.alimento.io/items/45/17315904172207551.jpg", description: "Roast beef, cheddar, mixed sauce, lettuce" },
      { name: "Salami", price: 160, image: "https://media.alimento.io/items/45/17315903362025022.jpg", description: "Salami, cheddar, rocca, mixed sauce" },
      { name: "Tuna Mayo", price: 160, image: "https://media.alimento.io/items/45/17315820056218527.jpg", description: "Tuna, bell pepper, mayo sauce, sweetcorn, rocca" },
      { name: "Chick'n Mushroom", price: 190, image: "https://media.alimento.io/items/45/17315822582384749.jpg", description: "Smoked chicken, lettuce, mushroom, jalapeño, spicy sauce", tags: ["spicy"] },
      { name: "Smoky Streaky", price: 180, image: "https://media.alimento.io/items/45/17324124541383922.jpg", description: "Streaky bacon, smoked turkey, mozzarella, smokey ranch, lettuce, pickles", tags: ["new"] },
    ],
  },
  {
    name: "Bagel",
    items: [
      { name: "Salmon Slay", price: 265, image: "https://media.alimento.io/items/45/17315843006066114.png", description: "Smoked salmon, capers, cream cheese, lemon, rocca", tags: ["topRated"] },
      { name: "Smok'n Turkey Pesto", price: 165, image: "https://media.alimento.io/items/45/17315794525951603.jpg", description: "Smoked turkey, pesto sauce, parmesan, sundried tomato, rocca" },
      { name: "Tuna Mayo Bagel", price: 150, image: "https://media.alimento.io/items/45/17315820056218527.jpg", description: "Tuna, bell pepper, mayo sauce, sweetcorn, rocca" },
      { name: "Mix Cold Cuts", price: 175, image: "https://media.alimento.io/items/45/17324124195093164.jpg", description: "Smoked turkey, roast beef, cheddar, lettuce, mixed sauce" },
      { name: "Greek Feta", price: 80, image: "https://media.alimento.io/items/45/17315799779392191.jpg", description: "Feta cheese, lettuce, tomato, black olive" },
      { name: "Creamy Strawberry", price: 90, image: "https://media.alimento.io/items/45/17467502548717226.jpg", description: "Cream cheese, strawberry jam" },
    ],
  },
  {
    name: "Salad",
    items: [
      { name: "Tuna Twist", price: 185, image: "https://media.alimento.io/items/45/17315820362077361.jpg", description: "Tuna, corn, bell pepper, mayo, lettuce" },
      { name: "Chick'n Caesar", price: 185, image: "https://media.alimento.io/items/45/17315794748044240.jpg", description: "Chicken, lettuce, toast, parmesan, caesar sauce" },
      { name: "Quinoa Era", price: 260, image: "https://media.alimento.io/items/45/17315799779392191.jpg", description: "Quinoa, avocado, BBQ chicken, red beans, cherry tomato, corn, bell pepper, ranch", tags: ["new"] },
      { name: "Greek", price: 260, image: "https://media.alimento.io/items/45/17315799779392191.jpg", description: "Feta cheese, cucumber, lettuce, cherry tomato, olive oil with thyme" },
    ],
  },
  {
    name: "Appetizers",
    items: [
      { name: "Waffle Fries", price: 85, image: "https://media.alimento.io/items/45/17467489946175418.jpg", tags: ["new"] },
      { name: "Sweet Potato Fries", price: 85, image: "https://media.alimento.io/items/45/17467495569817093.jpg", tags: ["new"] },
      { name: "Fries", price: 65, image: "https://media.alimento.io/items/45/17467489946175418.jpg" },
    ],
  },
  {
    name: "Sweet Addicts",
    items: [
      { name: "Matcha Budding", price: 120, image: "https://media.alimento.io/items/45/17467500953975713.jpg", tags: ["new"] },
      { name: "Sweet Potato Budding", price: 100, image: "https://media.alimento.io/items/45/17467500953975713.jpg", tags: ["new"] },
      { name: "Mini Pancake (15 Pcs)", price: 125, image: "https://media.alimento.io/items/45/17315809701452016.jpg" },
      { name: "Cheese Cake", price: 120, image: "https://media.alimento.io/items/45/17467502548717226.jpg" },
      { name: "Carrot Cake", price: 120, image: "https://media.alimento.io/items/45/17315335353084150.png" },
      { name: "Tiramisu", price: 120, image: "https://media.alimento.io/items/45/17467500953975713.jpg", tags: ["new"] },
      { name: "Nutella / Lotus Croissant", price: 110, image: "https://media.alimento.io/items/45/17467509967583108.jpg" },
      { name: "Plain Croissant", price: 80, image: "https://media.alimento.io/items/45/17467509967583108.jpg" },
      { name: "Pistachio Croissant", price: 135, image: "https://media.alimento.io/items/45/17467509967583108.jpg" },
    ],
  },
];

async function importMenu() {
  try {
    console.log("Checking for existing menu items...");
    const snapshot = await getDocs(collection(db, "menu"));
    
    if (snapshot.size > 0) {
      console.log(`✗ Menu already has ${snapshot.size} items. Skipping import.`);
      process.exit(0);
    }

    console.log("Importing menu items to Firestore...\n");

    let totalItems = 0;

    for (const category of menuData) {
      console.log(`📁 ${category.name}:`);
      
      for (const item of category.items) {
        const menuItem = {
          name: item.name,
          nameAr: "",
          description: item.description || "",
          price: item.price,
          category: category.name,
          image: item.image,
          tags: item.tags || [],
          createdAt: new Date()
        };

        await addDoc(collection(db, "menu"), menuItem);
        console.log(`  ✓ ${item.name} - ${item.price} EGP`);
        totalItems++;
      }
      console.log();
    }

    console.log("========================================");
    console.log(`✓ Successfully imported ${totalItems} menu items!`);
    console.log("========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error importing menu:", error.message);
    process.exit(1);
  }
}

importMenu();
