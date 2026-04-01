// Shayboub Winter Menu data
export const LOGO_URL = "/images/shayboub-logo-orange.png";
export const BANNER_URL = "https://media.alimento.io/business_banner/45/17312570137548139.png";

export type MenuItem = {
  name: string;
  price: string;
  image: string;
  description?: string;
  tags?: string[]; // "new", "spicy", "top"
};

export type MenuCategory = {
  name: string;
  items: MenuItem[];
};

export const menuData: MenuCategory[] = [
  {
    name: "Hot Coffee",
    items: [
      { name: "Espresso", price: "EGP 60", image: "https://media.alimento.io/items/45/17315799216369701.jpg" },
      { name: "Macchiato", price: "EGP 70", image: "https://media.alimento.io/items/45/17324884267363171.jpg" },
      { name: "Americano", price: "EGP 65", image: "https://media.alimento.io/items/45/17324886679011747.jpg" },
      { name: "Cortado", price: "EGP 75", image: "https://media.alimento.io/items/45/17324108918451024.jpg" },
      { name: "Flat White", price: "EGP 80", image: "https://media.alimento.io/items/45/17315799311037167.jpg" },
      { name: "Cappuccino", price: "EGP 90", image: "https://media.alimento.io/items/45/17324884537042942.jpg" },
      { name: "Latte", price: "EGP 90", image: "https://media.alimento.io/items/45/17324884626216750.jpg" },
    ],
  },
  {
    name: "Signature Hot",
    items: [
      { name: "Spanish Latte", price: "EGP 110", image: "https://media.alimento.io/items/45/17324885781303642.jpg" },
      { name: "Pistachio Latte", price: "EGP 135", image: "https://media.alimento.io/items/45/17467469076453353.jpg" },
      { name: "Salted Caramel", price: "EGP 120", image: "https://media.alimento.io/items/45/17324885901963767.jpg" },
      { name: "Mocha", price: "EGP 110", image: "https://media.alimento.io/items/45/17324886515876576.jpg" },
      { name: "White Mocha", price: "EGP 110", image: "https://media.alimento.io/items/45/17324886597038988.jpg" },
      { name: "Spicy Cinnamon Latte", price: "EGP 125", image: "https://media.alimento.io/items/45/17324886515876576.jpg", tags: ["spicy"] },
      { name: "Salted Vanilla Latte", price: "EGP 125", image: "https://media.alimento.io/items/45/17324885781303642.jpg" },
      { name: "Spiced Banoffee", price: "EGP 125", image: "https://media.alimento.io/items/45/17324886515876576.jpg", tags: ["new"] },
      { name: "Ginger Bread", price: "EGP 125", image: "https://media.alimento.io/items/45/17324886515876576.jpg", tags: ["new"] },
    ],
  },
  {
    name: "Hot Sweet Potato",
    items: [
      { name: "Classic", price: "EGP 110", image: "https://media.alimento.io/items/45/17324886947287046.jpg", tags: ["new"] },
      { name: "Crème Brûlée", price: "EGP 130", image: "https://media.alimento.io/items/45/17324886947287046.jpg", tags: ["new"] },
      { name: "Salted Caramel", price: "EGP 120", image: "https://media.alimento.io/items/45/17324886947287046.jpg", tags: ["new"] },
      { name: "Lotus", price: "EGP 120", image: "https://media.alimento.io/items/45/17324886947287046.jpg", tags: ["new"] },
    ],
  },
  {
    name: "Hot Chocolate",
    items: [
      { name: "Signature Mellows", price: "EGP 110", image: "https://media.alimento.io/items/45/17324886947287046.jpg", tags: ["new"] },
      { name: "Strawberry", price: "EGP 125", image: "https://media.alimento.io/items/45/17324886947287046.jpg" },
      { name: "White Choco", price: "EGP 120", image: "https://media.alimento.io/items/45/17324886947287046.jpg" },
    ],
  },
  {
    name: "Ice Coffee",
    items: [
      { name: "Ice Americano", price: "EGP 75 / 90", image: "https://media.alimento.io/items/45/17467145451457878.png" },
      { name: "Ice Latte", price: "EGP 90 / 110", image: "https://media.alimento.io/items/45/17467156332166078.png" },
      { name: "Ice Spanish Latte", price: "EGP 115 / 135", image: "https://media.alimento.io/items/45/17467248442221448.jpg", tags: ["top"] },
      { name: "Ice White Mocha", price: "EGP 120 / 140", image: "https://media.alimento.io/items/45/17467284084465300.jpg" },
      { name: "Ice Mocha", price: "EGP 110 / 130", image: "https://media.alimento.io/items/45/17315836327986758.jpg" },
      { name: "Ice Salted Caramel", price: "EGP 135 / 155", image: "https://media.alimento.io/items/45/17467207432565675.jpg" },
      { name: "Ice Salted Vanilla", price: "EGP 120 / 140", image: "https://media.alimento.io/items/45/17467207432565675.jpg" },
      { name: "Ice Pistachio Latte", price: "EGP 145 / 165", image: "https://media.alimento.io/items/45/17467469076453353.jpg" },
      { name: "Coffee Frappe", price: "EGP 100 / 120", image: "https://media.alimento.io/items/45/17467266088164820.jpg" },
      { name: "Spicy Spanish Cinna", price: "EGP 115 / 135", image: "https://media.alimento.io/items/45/17467206802341889.jpg", tags: ["spicy"] },
      { name: "Spiced Banoffee", price: "EGP 155", image: "https://media.alimento.io/items/45/17467206802341889.jpg", tags: ["new"] },
      { name: "Ginger Bread", price: "EGP 155", image: "https://media.alimento.io/items/45/17467206802341889.jpg", tags: ["new"] },
      { name: "Cherry Vanilla", price: "EGP 155", image: "https://media.alimento.io/items/45/17467206802341889.jpg", tags: ["new"] },
    ],
  },
  {
    name: "Hojicha",
    items: [
      { name: "Hojicha Latte", price: "EGP 130", image: "https://media.alimento.io/items/45/17467147189372754.jpg", tags: ["new"] },
      { name: "White Chocolate Hojicha", price: "EGP 165", image: "https://media.alimento.io/items/45/17467147189372754.jpg", tags: ["new"] },
      { name: "Spiced Banoffee Hojicha", price: "EGP 170", image: "https://media.alimento.io/items/45/17467147189372754.jpg", tags: ["new"] },
      { name: "Cherry Hojicha", price: "EGP 140", image: "https://media.alimento.io/items/45/17467147189372754.jpg", tags: ["new"] },
      { name: "Cloud Hojicha", price: "EGP 130", image: "https://media.alimento.io/items/45/17467147189372754.jpg", tags: ["new"] },
      { name: "Blue Hojicha", price: "EGP 170", image: "https://media.alimento.io/items/45/17467147189372754.jpg", tags: ["new"] },
      { name: "Pink Hojicha", price: "EGP 170", image: "https://media.alimento.io/items/45/17467147189372754.jpg", tags: ["new"] },
    ],
  },
  {
    name: "Matcha",
    items: [
      { name: "Matcha Latte", price: "EGP 130", image: "https://media.alimento.io/items/45/17467149293283863.png" },
      { name: "Pistachio Matcha", price: "EGP 160", image: "https://media.alimento.io/items/45/17467147189372754.jpg" },
      { name: "Iced Matcha", price: "EGP 130 / 150", image: "https://media.alimento.io/items/45/17467149293283863.png" },
      { name: "Salted Caramel Matcha", price: "EGP 135 / 155", image: "https://media.alimento.io/items/45/17467488169604393.jpg" },
      { name: "Pistachio Matcha", price: "EGP 170 / 190", image: "https://media.alimento.io/items/45/17467469076453353.jpg" },
      { name: "Salted Vanilla Matcha", price: "EGP 135 / 155", image: "https://media.alimento.io/items/45/17467488169604393.jpg" },
      { name: "White Choco Matcha", price: "EGP 155", image: "https://media.alimento.io/items/45/17469225121041215.jpeg" },
      { name: "Matcha Fruit Blend", price: "EGP 140 / 160", image: "https://media.alimento.io/items/45/17467231599519767.jpg", description: "Strawberry, Coco, Blueberry, Mango, Cherry" },
      { name: "Pink Blush Matcha", price: "EGP 170 / 190", image: "https://media.alimento.io/items/45/17467231599519767.jpg", tags: ["new"] },
      { name: "Blue Breeze Matcha", price: "EGP 170 / 190", image: "https://media.alimento.io/items/45/17469225121041215.jpeg", tags: ["new"] },
      { name: "Spiced Banoffee Matcha", price: "EGP 170", image: "https://media.alimento.io/items/45/17467488169604393.jpg", tags: ["new"] },
      { name: "Ginger Bread Matcha", price: "EGP 170", image: "https://media.alimento.io/items/45/17467488169604393.jpg", tags: ["new"] },
      { name: "Matcha Birthday", price: "EGP 170", image: "https://media.alimento.io/items/45/17467488169604393.jpg", tags: ["new"] },
    ],
  },
  {
    name: "Brewing Coffee",
    items: [
      { name: "V60", price: "EGP 130", image: "https://media.alimento.io/items/45/17324887205336489.jpg" },
      { name: "Iced V60", price: "EGP 130", image: "https://media.alimento.io/items/45/17467144122866851.png" },
      { name: "Cold Brew", price: "EGP 130", image: "https://media.alimento.io/items/45/17467144312481059.png" },
    ],
  },
  {
    name: "Redbull Creations",
    items: [
      { name: "NeonBurn", price: "EGP 175", image: "https://media.alimento.io/items/45/17315824769476131.jpg", tags: ["new"] },
      { name: "SunBurn", price: "EGP 175", image: "https://media.alimento.io/items/45/17315824769476131.jpg", tags: ["new"] },
      { name: "CocoRose", price: "EGP 175", image: "https://media.alimento.io/items/45/17315824769476131.jpg", tags: ["new"] },
      { name: "BerryVanilla", price: "EGP 175", image: "https://media.alimento.io/items/45/17315824769476131.jpg", tags: ["new"] },
    ],
  },
  {
    name: "Shaky Frappe",
    items: [
      { name: "Caramel Frappe", price: "EGP 110", image: "https://media.alimento.io/items/45/17467266379891024.jpg" },
      { name: "Vanilla Frappe", price: "EGP 110", image: "https://media.alimento.io/items/45/17467468783788053.jpg" },
      { name: "Strawberry Frappe", price: "EGP 110", image: "https://media.alimento.io/items/45/17467468783788053.jpg" },
      { name: "Chocolate Frappe", price: "EGP 110", image: "https://media.alimento.io/items/45/17467467756756049.jpg" },
      { name: "Pistachio Frappe", price: "EGP 135", image: "https://media.alimento.io/items/45/17467469076453353.jpg" },
      { name: "Spiced Banoffee Frappe", price: "EGP 135", image: "https://media.alimento.io/items/45/17467266643645043.jpg", tags: ["new"] },
      { name: "Banana S Caramel Frappe", price: "EGP 135", image: "https://media.alimento.io/items/45/17467266379891024.jpg", tags: ["new"] },
    ],
  },
  {
    name: "Ice Tea",
    items: [
      { name: "Ice Tea Peach", price: "EGP 100", image: "https://media.alimento.io/items/45/17467210446570481.jpg" },
      { name: "Ice Tea Blueberry", price: "EGP 100", image: "https://media.alimento.io/items/45/17315841469717343.jpg" },
      { name: "Ice Tea Raspberry", price: "EGP 100", image: "https://media.alimento.io/items/45/17467146484248504.jpg" },
    ],
  },
  {
    name: "Classic Hot Tea",
    items: [
      { name: "Spicy Winter", price: "EGP 110", image: "https://media.alimento.io/items/45/17324110225270526.jpg", tags: ["new", "spicy"] },
      { name: "Black Tea", price: "EGP 50", image: "https://media.alimento.io/items/45/17315787535123284.jpg" },
      { name: "Green Tea Mint", price: "EGP 50", image: "https://media.alimento.io/items/45/17324110027377877.jpg" },
      { name: "Hot Cider", price: "EGP 85", image: "https://media.alimento.io/items/45/17324110404824408.jpg" },
      { name: "Lemon Ginger", price: "EGP 85", image: "https://media.alimento.io/items/45/17324110404824408.jpg" },
    ],
  },
  {
    name: "Mojito",
    items: [
      { name: "Classic Mojito", price: "EGP 130", image: "https://media.alimento.io/items/45/17315798937145075.jpg" },
      { name: "Berry Kiss", price: "EGP 130", image: "https://media.alimento.io/items/45/17467151433736698.jpg", tags: ["top"] },
      { name: "Blueberry Mojito", price: "EGP 130", image: "https://media.alimento.io/items/45/17315841469717343.jpg" },
      { name: "Passion Fruit Mojito", price: "EGP 130", image: "https://media.alimento.io/items/45/17467485377801354.jpg" },
      { name: "Ocean Blue Mojito", price: "EGP 130", image: "https://media.alimento.io/items/45/17467152096203019.jpg" },
      { name: "Peach Mojito", price: "EGP 130", image: "https://media.alimento.io/items/45/17467210446570481.jpg" },
      { name: "Redbull Mojito", price: "EGP 165", image: "https://media.alimento.io/items/45/17315824769476131.jpg" },
    ],
  },
  {
    name: "Smoothies",
    items: [
      { name: "Passion Smoothie", price: "EGP 130", image: "https://media.alimento.io/items/45/17467155836170700.jpg" },
      { name: "Piña Colada Smoothie", price: "EGP 130", image: "https://media.alimento.io/items/45/17467480489000391.jpg" },
      { name: "Blueberry Smoothie", price: "EGP 130", image: "https://media.alimento.io/items/45/17467150646456610.jpg" },
      { name: "Watermelon Smoothie", price: "EGP 130", image: "https://media.alimento.io/items/45/17467150383216097.jpg" },
      { name: "Peach Mango Smoothie", price: "EGP 130", image: "https://media.alimento.io/items/45/17467291857789053.jpg", tags: ["top"] },
    ],
  },
  {
    name: "Fresh Juice",
    items: [
      { name: "Orange", price: "EGP 90", image: "https://media.alimento.io/items/45/17467153217968669.png", tags: ["top"] },
      { name: "Lemon Mint", price: "EGP 95", image: "https://media.alimento.io/items/45/17440342612932340.jpg" },
      { name: "Watermelon", price: "EGP 100", image: "https://media.alimento.io/items/45/17467153554956309.jpg" },
    ],
  },
  {
    name: "Crave Club - SQR Bun",
    items: [
      { name: "Signature Smok'n Chicken", price: "EGP 170", image: "https://media.alimento.io/items/45/17315822582384749.jpg", description: "Chicken, bell pepper, lettuce, choice of sauce (Ranch/BBQ/Tasty/Spicy Mayo/Sweet Chilli/Buffalo)", tags: ["top"] },
      { name: "Buffalo Beef", price: "EGP 180", image: "https://media.alimento.io/items/45/17315904172207551.jpg", description: "Beef bacon, salami, buffalo sauce, cheddar, mayo, tomato, pickles, lettuce" },
      { name: "The Caesar", price: "EGP 190", image: "https://media.alimento.io/items/45/17315794748044240.jpg", description: "Smoked chicken, parmesan, caesar sauce, lettuce" },
      { name: "Mix Cheese", price: "EGP 140", image: "https://media.alimento.io/items/45/17315813311550788.jpg", description: "Cheddar, mozzarella, emmental, lettuce, mixed sauce" },
      { name: "Smok'n Turkey", price: "EGP 150", image: "https://media.alimento.io/items/45/17315903775391463.jpg", description: "Smoked turkey, cheddar, mixed sauce, lettuce" },
      { name: "Chick'n Pesto", price: "EGP 190", image: "https://media.alimento.io/items/45/17315794525951603.jpg", description: "Chicken smoked/grilled, pesto sauce, parmesan, sundried tomato, lettuce" },
    ],
  },
  {
    name: "Crave Club - Sourdough",
    items: [
      { name: "Roast Beef", price: "EGP 180", image: "https://media.alimento.io/items/45/17315904172207551.jpg", description: "Roast beef, cheddar, mixed sauce, lettuce" },
      { name: "Salami", price: "EGP 160", image: "https://media.alimento.io/items/45/17315903362025022.jpg", description: "Salami, cheddar, rocca, mixed sauce" },
      { name: "Tuna Mayo", price: "EGP 160", image: "https://media.alimento.io/items/45/17315820056218527.jpg", description: "Tuna, bell pepper, mayo sauce, sweetcorn, rocca" },
      { name: "Chick'n Mushroom", price: "EGP 190", image: "https://media.alimento.io/items/45/17315822582384749.jpg", description: "Smoked chicken, lettuce, mushroom, jalapeño, spicy sauce", tags: ["spicy"] },
      { name: "Smoky Streaky", price: "EGP 180", image: "https://media.alimento.io/items/45/17324124541383922.jpg", description: "Streaky bacon, smoked turkey, mozzarella, smokey ranch, lettuce, pickles", tags: ["new"] },
    ],
  },
  {
    name: "Bagel",
    items: [
      { name: "Salmon Slay", price: "EGP 265", image: "https://media.alimento.io/items/45/17315843006066114.png", description: "Smoked salmon, capers, cream cheese, lemon, rocca", tags: ["top"] },
      { name: "Smok'n Turkey Pesto", price: "EGP 165", image: "https://media.alimento.io/items/45/17315794525951603.jpg", description: "Smoked turkey, pesto sauce, parmesan, sundried tomato, rocca" },
      { name: "Tuna Mayo Bagel", price: "EGP 150", image: "https://media.alimento.io/items/45/17315820056218527.jpg", description: "Tuna, bell pepper, mayo sauce, sweetcorn, rocca" },
      { name: "Mix Cold Cuts", price: "EGP 175", image: "https://media.alimento.io/items/45/17324124195093164.jpg", description: "Smoked turkey, roast beef, cheddar, lettuce, mixed sauce" },
      { name: "Greek Feta", price: "EGP 80", image: "https://media.alimento.io/items/45/17315799779392191.jpg", description: "Feta cheese, lettuce, tomato, black olive" },
      { name: "Creamy Strawberry", price: "EGP 90", image: "https://media.alimento.io/items/45/17467502548717226.jpg", description: "Cream cheese, strawberry jam" },
    ],
  },
  {
    name: "Salad",
    items: [
      { name: "Tuna Twist", price: "EGP 185", image: "https://media.alimento.io/items/45/17315820362077361.jpg", description: "Tuna, corn, bell pepper, mayo, lettuce" },
      { name: "Chick'n Caesar", price: "EGP 185", image: "https://media.alimento.io/items/45/17315794748044240.jpg", description: "Chicken, lettuce, toast, parmesan, caesar sauce" },
      { name: "Quinoa Era", price: "EGP 260", image: "https://media.alimento.io/items/45/17315799779392191.jpg", description: "Quinoa, avocado, BBQ chicken, red beans, cherry tomato, corn, bell pepper, ranch", tags: ["new"] },
      { name: "Greek", price: "EGP 260", image: "https://media.alimento.io/items/45/17315799779392191.jpg", description: "Feta cheese, cucumber, lettuce, cherry tomato, olive oil with thyme" },
    ],
  },
  {
    name: "Appetizers",
    items: [
      { name: "Waffle Fries", price: "EGP 85", image: "https://media.alimento.io/items/45/17467489946175418.jpg", tags: ["new"] },
      { name: "Sweet Potato Fries", price: "EGP 85", image: "https://media.alimento.io/items/45/17467495569817093.jpg", tags: ["new"] },
      { name: "Fries", price: "EGP 65", image: "https://media.alimento.io/items/45/17467489946175418.jpg" },
    ],
  },
  {
    name: "Sweet Addicts",
    items: [
      { name: "Matcha Budding", price: "EGP 120", image: "https://media.alimento.io/items/45/17467500953975713.jpg", tags: ["new"] },
      { name: "Sweet Potato Budding", price: "EGP 100", image: "https://media.alimento.io/items/45/17467500953975713.jpg", tags: ["new"] },
      { name: "Mini Pancake (15 Pcs)", price: "EGP 125", image: "https://media.alimento.io/items/45/17315809701452016.jpg" },
      { name: "Cheese Cake", price: "EGP 120", image: "https://media.alimento.io/items/45/17467502548717226.jpg" },
      { name: "Carrot Cake", price: "EGP 120", image: "https://media.alimento.io/items/45/17315335353084150.png" },
      { name: "Tiramisu", price: "EGP 120", image: "https://media.alimento.io/items/45/17467500953975713.jpg", tags: ["new"] },
      { name: "Nutella / Lotus Croissant", price: "EGP 110", image: "https://media.alimento.io/items/45/17467509967583108.jpg" },
      { name: "Plain Croissant", price: "EGP 80", image: "https://media.alimento.io/items/45/17467509967583108.jpg" },
      { name: "Pistachio Croissant", price: "EGP 135", image: "https://media.alimento.io/items/45/17467509967583108.jpg" },
    ],
  },
];

export const locations = [
  {
    city: "New Cairo",
    address: "شيل اوت التسعين، اسفل El-Moshir Tantawy Axis, Al Hay Al Asher, Nasr City, Cairo Governorate 11835",
    mapUrl: "https://maps.google.com/?q=El-Moshir+Tantawy+Axis+Nasr+City+Cairo",
  },
  {
    city: "Kafr Abdou, Alexandria",
    address: "30 Abd El Aziz Agamya St, Off Saint Jenny St, Alexandria Governorate 5433124",
    mapUrl: "https://maps.google.com/?q=30+abd+el+aziz+agamya+st+kafr+abdou+alexandria",
  },
  {
    city: "Gleem, Alexandria",
    address: "5 Ahmed Yehia St, El Raml 1, Alexandria Governorate 21532",
    mapUrl: "https://maps.google.com/?q=5+Ahmed+Yehia+St+El+Raml+Alexandria",
  },
];
