// Real Shayboub menu data from their ordering platform
export const LOGO_URL = "https://media.alimento.io/logos/45/17391982875862431.jpg";
export const BANNER_URL = "https://media.alimento.io/business_banner/45/17312570137548139.png";

export type MenuItem = {
  name: string;
  price: string;
  image: string;
  description?: string;
};

export type MenuCategory = {
  name: string;
  items: MenuItem[];
};

export const menuData: MenuCategory[] = [
  {
    name: "Hot Coffee",
    items: [
      { name: "Espresso", price: "EGP 45", image: "https://media.alimento.io/items/45/17315799216369701.jpg" },
      { name: "Espresso Conbana", price: "EGP 65", image: "https://media.alimento.io/items/45/17324884171162293.jpg" },
      { name: "Café Macchiato", price: "EGP 50", image: "https://media.alimento.io/items/45/17324884267363171.jpg" },
      { name: "Classic Cortado", price: "EGP 75", image: "https://media.alimento.io/items/45/17324108918451024.jpg" },
      { name: "Caramel Cortado", price: "EGP 85", image: "https://media.alimento.io/items/45/17324108984213845.jpg" },
      { name: "Cappuccino", price: "EGP 95", image: "https://media.alimento.io/items/45/17324884537042942.jpg" },
      { name: "Latte", price: "EGP 95", image: "https://media.alimento.io/items/45/17324884626216750.jpg" },
      { name: "Spanish Latte", price: "EGP 110", image: "https://media.alimento.io/items/45/17324885781303642.jpg" },
      { name: "Flat White", price: "EGP 80", image: "https://media.alimento.io/items/45/17315799311037167.jpg" },
      { name: "Caramel Macchiato", price: "EGP 95", image: "https://media.alimento.io/items/45/17324885901963767.jpg" },
      { name: "Caramel Choco Latte", price: "EGP 110", image: "https://media.alimento.io/items/45/17324886001382794.jpg" },
      { name: "Mocha", price: "EGP 110", image: "https://media.alimento.io/items/45/17324886515876576.jpg" },
      { name: "White Mocha", price: "EGP 95", image: "https://media.alimento.io/items/45/17324886597038988.jpg" },
      { name: "Americano", price: "EGP 85", image: "https://media.alimento.io/items/45/17324886679011747.jpg" },
      { name: "Turkish Coffee", price: "EGP 40", image: "https://media.alimento.io/items/45/17315893978006016.jpg" },
      { name: "French Coffee", price: "EGP 50", image: "https://media.alimento.io/items/45/17315832122068033.jpg" },
      { name: "Nutella Coffee", price: "EGP 70", image: "https://media.alimento.io/items/45/17324109919558687.jpg" },
      { name: "Hot Tea", price: "EGP 40", image: "https://media.alimento.io/items/45/17315787535123284.jpg" },
      { name: "Tea Flavour", price: "EGP 40", image: "https://media.alimento.io/items/45/17324110027377877.jpg" },
      { name: "Milk Tea", price: "EGP 45", image: "https://media.alimento.io/items/45/17324110144401508.jpg" },
      { name: "Karak Tea", price: "EGP 70", image: "https://media.alimento.io/items/45/17324110225270526.jpg" },
      { name: "Hot Chocolate", price: "EGP 120", image: "https://media.alimento.io/items/45/17324886947287046.jpg" },
      { name: "Hot Cider", price: "EGP 80", image: "https://media.alimento.io/items/45/17324110404824408.jpg" },
      { name: "Hot V60", price: "EGP 110", image: "https://media.alimento.io/items/45/17324887205336489.jpg" },
    ],
  },
  {
    name: "Specialty Coffee",
    items: [
      { name: "Iced Drip V60", price: "EGP 110", image: "https://media.alimento.io/items/45/17467144122866851.png" },
      { name: "Cold Brew", price: "EGP 120", image: "https://media.alimento.io/items/45/17467144312481059.png" },
    ],
  },
  {
    name: "Ice Coffee",
    items: [
      { name: "Ice Latte", price: "EGP 130", image: "https://media.alimento.io/items/45/17467156332166078.png" },
      { name: "Ice Cappuccino", price: "EGP 130", image: "https://media.alimento.io/items/45/17469224831981315.jpeg" },
      { name: "Ice Americano", price: "EGP 115", image: "https://media.alimento.io/items/45/17467145451457878.png" },
      { name: "Ice Spanish Latte", price: "EGP 125", image: "https://media.alimento.io/items/45/17467248442221448.jpg" },
      { name: "Ice Spanish Caramel Latte", price: "EGP 135", image: "https://media.alimento.io/items/45/17467206802341889.jpg" },
      { name: "Ice Irish Spanish Latte", price: "EGP 135", image: "https://media.alimento.io/items/45/17467145932607859.jpg" },
      { name: "Ice Caramel Macchiato", price: "EGP 115", image: "https://media.alimento.io/items/45/17467206994040392.jpg" },
      { name: "Ice Mocha", price: "EGP 115", image: "https://media.alimento.io/items/45/17315836327986758.jpg" },
      { name: "Ice White Mocha", price: "EGP 115", image: "https://media.alimento.io/items/45/17467284084465300.jpg" },
      { name: "Ice Salted Caramel Latte", price: "EGP 120", image: "https://media.alimento.io/items/45/17467207432565675.jpg" },
      { name: "Ice Chocolate", price: "EGP 115", image: "https://media.alimento.io/items/45/17467467426360716.jpg" },
    ],
  },
  {
    name: "Ice Tea",
    items: [
      { name: "Ice Tea Peach", price: "EGP 120", image: "https://media.alimento.io/items/45/17467210446570481.jpg" },
      { name: "Ice Tea Raspberry", price: "EGP 120", image: "https://media.alimento.io/items/45/17467146484248504.jpg" },
    ],
  },
  {
    name: "Matcha",
    items: [
      { name: "Hot Matcha", price: "EGP 120", image: "https://media.alimento.io/items/45/17467147189372754.jpg" },
      { name: "Ice Matcha Latte", price: "EGP 130", image: "https://media.alimento.io/items/45/17467149293283863.png" },
      { name: "Ice Matcha Frappe", price: "EGP 155", image: "https://media.alimento.io/items/45/17467488169604393.jpg" },
      { name: "Strawberry Matcha Frappe", price: "EGP 165", image: "https://media.alimento.io/items/45/17467231599519767.jpg" },
      { name: "Blueberry Matcha Frappe", price: "EGP 165", image: "https://media.alimento.io/items/45/17469225121041215.jpeg" },
      { name: "Coconut Matcha Frappe", price: "EGP 165", image: "https://media.alimento.io/items/45/17467220005827960.jpg" },
      { name: "Dirty Matcha", price: "EGP 140", image: "https://media.alimento.io/items/45/17467147189372754.jpg" },
      { name: "Pistachio Matcha", price: "EGP 91", image: "https://media.alimento.io/items/45/17467147189372754.jpg" },
    ],
  },
  {
    name: "Frappe",
    items: [
      { name: "Frappe Latte", price: "EGP 120", image: "https://media.alimento.io/items/45/17467266088164820.jpg" },
      { name: "Frappe Caramel", price: "EGP 135", image: "https://media.alimento.io/items/45/17467266379891024.jpg" },
      { name: "Frappe Lotus", price: "EGP 140", image: "https://media.alimento.io/items/45/17467266643645043.jpg" },
      { name: "Frappe Chocolate", price: "EGP 135", image: "https://media.alimento.io/items/45/17467467756756049.jpg" },
      { name: "Frappe Mocha", price: "EGP 135", image: "https://media.alimento.io/items/45/17467266865999537.jpg" },
      { name: "Frappe White Mocha", price: "EGP 135", image: "https://media.alimento.io/items/45/17315839171094790.jpg" },
      { name: "Frappe Vanilla", price: "EGP 135", image: "https://media.alimento.io/items/45/17467468783788053.jpg" },
      { name: "Frappe Pistachio", price: "EGP 165", image: "https://media.alimento.io/items/45/17467469076453353.jpg" },
      { name: "Frappe Cookies", price: "EGP 135", image: "https://media.alimento.io/items/45/17467267492781041.jpg" },
      { name: "Frappe Oreo", price: "EGP 135", image: "https://media.alimento.io/items/45/17467267372075626.jpg" },
    ],
  },
  {
    name: "Smoothies",
    items: [
      { name: "Strawberry Smoothie", price: "EGP 130", image: "https://media.alimento.io/items/45/17467149963928358.jpg" },
      { name: "Blueberry Smoothie", price: "EGP 140", image: "https://media.alimento.io/items/45/17467150646456610.jpg" },
      { name: "Piña Colada Smoothie", price: "EGP 140", image: "https://media.alimento.io/items/45/17467480489000391.jpg" },
      { name: "Green Apple Smoothie", price: "EGP 130", image: "https://media.alimento.io/items/45/17467469577682123.jpg" },
      { name: "Watermelon Smoothie", price: "EGP 140", image: "https://media.alimento.io/items/45/17467150383216097.jpg" },
      { name: "Mix Berries Smoothie", price: "EGP 140", image: "https://media.alimento.io/items/45/17467150198416988.jpg" },
      { name: "Mango Smoothie", price: "EGP 130", image: "https://media.alimento.io/items/45/17467484586629211.jpg" },
      { name: "Passion Smoothie", price: "EGP 130", image: "https://media.alimento.io/items/45/17467155836170700.jpg" },
      { name: "Passion Mango Smoothie", price: "EGP 140", image: "https://media.alimento.io/items/45/17467291857789053.jpg" },
      { name: "Mix Fruits Smoothie", price: "EGP 140", image: "https://media.alimento.io/items/45/17467476546991480.jpg" },
    ],
  },
  {
    name: "Milkshake",
    items: [
      { name: "Vanilla Shake", price: "EGP 125", image: "https://media.alimento.io/items/45/17467473874593359.jpg" },
      { name: "Chocolate Shake", price: "EGP 125", image: "https://media.alimento.io/items/45/17467475134184269.jpg" },
      { name: "Caramel Shake", price: "EGP 135", image: "https://media.alimento.io/items/45/17467276843479188.jpg" },
      { name: "Strawberry Shake", price: "EGP 135", image: "https://media.alimento.io/items/45/17467470179341628.jpg" },
      { name: "Salted Caramel Shake", price: "EGP 135", image: "https://media.alimento.io/items/45/17467276985236314.jpg" },
      { name: "Mix Berries Shake", price: "EGP 135", image: "https://media.alimento.io/items/45/17467150956607422.jpg" },
      { name: "Lotus Shake", price: "EGP 145", image: "https://media.alimento.io/items/45/17467275882698994.jpg" },
      { name: "Pistachio Shake", price: "EGP 170", image: "https://media.alimento.io/items/45/17467470752061717.jpg" },
      { name: "Oreo Shake", price: "EGP 145", image: "https://media.alimento.io/items/45/17467276385554459.jpg" },
      { name: "Coffee Shake", price: "EGP 135", image: "https://media.alimento.io/items/45/17467473508196195.jpg" },
    ],
  },
  {
    name: "Mojito",
    items: [
      { name: "Classic Mojito", price: "EGP 130", image: "https://media.alimento.io/items/45/17315798937145075.jpg" },
      { name: "Red Bull Mojito", price: "EGP 165", image: "https://media.alimento.io/items/45/17315824769476131.jpg" },
      { name: "Strawberry Mojito", price: "EGP 140", image: "https://media.alimento.io/items/45/17467151433736698.jpg" },
      { name: "Blueberry Mojito", price: "EGP 140", image: "https://media.alimento.io/items/45/17315841469717343.jpg" },
      { name: "Passion Fruit Mojito", price: "EGP 140", image: "https://media.alimento.io/items/45/17467485377801354.jpg" },
      { name: "Blue Mojito", price: "EGP 140", image: "https://media.alimento.io/items/45/17467152096203019.jpg" },
    ],
  },
  {
    name: "Fresh Juices",
    items: [
      { name: "Orange", price: "EGP 95", image: "https://media.alimento.io/items/45/17467153217968669.png" },
      { name: "Mango", price: "EGP 125", image: "https://media.alimento.io/items/45/17467483942763323.jpg" },
      { name: "Strawberry", price: "EGP 125", image: "https://media.alimento.io/items/45/17467153761647361.jpg" },
      { name: "Watermelon", price: "EGP 125", image: "https://media.alimento.io/items/45/17467153554956309.jpg" },
      { name: "Guava", price: "EGP 125", image: "https://media.alimento.io/items/45/17467482723961802.jpg" },
      { name: "Lemonade Fresh Mint", price: "EGP 115", image: "https://media.alimento.io/items/45/17440342612932340.jpg" },
    ],
  },
  {
    name: "Chicken Sandwiches",
    items: [
      { name: "Spicy Chicken Mushroom", price: "EGP 125", image: "https://media.alimento.io/items/45/17315822582384749.jpg", description: "Chicken, lettuce, mushroom, jalapeño" },
      { name: "Chicken Pesto", price: "EGP 130", image: "https://media.alimento.io/items/45/17315794525951603.jpg", description: "Chicken, lettuce, pesto sauce, parmesan" },
      { name: "Chicken Avanti", price: "EGP 130", image: "https://media.alimento.io/items/45/17315795092879538.jpg", description: "Chicken, lettuce, bell pepper, avanti cheese, mixed sauce" },
      { name: "Chicken Mayo", price: "EGP 110", image: "https://media.alimento.io/items/45/17324121337275274.jpg", description: "Chicken, lettuce, bell pepper, mixed sauce" },
      { name: "Chicken Ranch", price: "EGP 110", image: "https://media.alimento.io/items/45/17315889365246987.jpg", description: "Chicken, lettuce, bell pepper, ranch sauce" },
      { name: "Chicken Tasty", price: "EGP 110", image: "https://media.alimento.io/items/45/17315890727434483.jpg", description: "Chicken, lettuce, bell pepper, ranch sauce" },
      { name: "Chicken BBQ", price: "EGP 110", image: "https://media.alimento.io/items/45/17315794962957932.jpg", description: "Chicken, lettuce, bell pepper, BBQ sauce" },
      { name: "Chicken 1000 Island", price: "EGP 110", image: "https://media.alimento.io/items/45/17324121613381402.jpg", description: "Chicken, lettuce, bell pepper, 1000 island sauce" },
      { name: "Spicy Chicken Lemon", price: "EGP 110", image: "https://media.alimento.io/items/45/17324123027041752.jpg", description: "Chicken, lettuce, ranch sauce, hot sauce, lemon saffron" },
      { name: "Chicken Curry", price: "EGP 110", image: "https://media.alimento.io/items/45/17324122593487850.jpg", description: "Chicken, lettuce, bell pepper, curry & ranch sauce" },
      { name: "Chicken Sriracha", price: "EGP 110", image: "https://media.alimento.io/items/45/17324123477070352.jpg", description: "Chicken, lettuce, 1000 island, cheddar, sriracha, pickles" },
      { name: "Chicken Sweet Chilli", price: "EGP 110", image: "https://media.alimento.io/items/45/17315901294637601.jpg", description: "Chicken, lettuce, sweet chilli, bell pepper" },
    ],
  },
  {
    name: "Cold Cuts & Seafood",
    items: [
      { name: "Mix Cheese", price: "EGP 100", image: "https://media.alimento.io/items/45/17315813311550788.jpg", description: "Cheddar, mozzarella, emmental, lettuce, mixed sauce" },
      { name: "Salami", price: "EGP 100", image: "https://media.alimento.io/items/45/17315903362025022.jpg", description: "Salami, cheddar, lettuce, mixed sauce" },
      { name: "Mix Cold Cuts", price: "EGP 110", image: "https://media.alimento.io/items/45/17324124195093164.jpg", description: "Smoked turkey, roast beef, cheddar, mixed sauce, lettuce" },
      { name: "Cheddar Smoked Turkey", price: "EGP 100", image: "https://media.alimento.io/items/45/17315903775391463.jpg", description: "Smoked turkey, cheddar, mixed sauce, lettuce" },
      { name: "Cheddar Roast Beef", price: "EGP 115", image: "https://media.alimento.io/items/45/17315904172207551.jpg", description: "Fresh roast beef, cheddar, mixed sauce, lettuce" },
      { name: "Tuna", price: "EGP 105", image: "https://media.alimento.io/items/45/17315820056218527.jpg", description: "Tuna, bell pepper, lettuce, mayo, black olive" },
      { name: "Shrimp Texas", price: "EGP 165", image: "https://media.alimento.io/items/45/17307513197342306.png", description: "Shrimp, bell pepper, lettuce, texas sauce" },
      { name: "Smoked Salmon", price: "EGP 210", image: "https://media.alimento.io/items/45/17315843006066114.png", description: "Smoked salmon, labneh, lemon dill, capers" },
    ],
  },
  {
    name: "Tortilla & Wraps",
    items: [
      { name: "Shrimp Quesadilla", price: "EGP 200", image: "https://media.alimento.io/items/45/17315823479931787.jpg", description: "Shrimp, mixed cheese, bell pepper, jalapeño, tartar sauce" },
      { name: "Chicken Quesadilla", price: "EGP 180", image: "https://media.alimento.io/items/45/17315794154332913.jpg", description: "Chicken, mixed cheese, bell pepper, jalapeño, BBQ" },
      { name: "Sriracha Strips", price: "EGP 165", image: "https://media.alimento.io/items/45/17324124541383922.jpg", description: "Strips, lettuce, 1000 island, cheddar, sriracha, pickles" },
      { name: "Cheesy Strips", price: "EGP 150", image: "https://media.alimento.io/items/45/17315823718715363.jpg", description: "Chicken, cheese sauce, lettuce, cheddar, pickles" },
      { name: "Turkey Cordon Bleu", price: "EGP 160", image: "https://media.alimento.io/items/45/17315843244059875.jpg", description: "Cordon bleu, smoked turkey, lettuce, mixed sauce, pickles, mozzarella" },
    ],
  },
  {
    name: "Salads",
    items: [
      { name: "Chicken Caesar Salad", price: "EGP 160", image: "https://media.alimento.io/items/45/17315794748044240.jpg", description: "Chicken, lettuce, toast, parmesan, caesar sauce" },
      { name: "Corn Tuna Salad", price: "EGP 150", image: "https://media.alimento.io/items/45/17315820362077361.jpg", description: "Lettuce, tuna, red beans, sweet corn, bell pepper, black olive, mayo" },
      { name: "Greek Salad", price: "EGP 100", image: "https://media.alimento.io/items/45/17315799779392191.jpg", description: "Lettuce, feta cheese, bell pepper, cucumber, cherry tomato, black olive, olive oil" },
    ],
  },
  {
    name: "Sides",
    items: [
      { name: "Fries", price: "EGP 65", image: "https://media.alimento.io/items/45/17467489946175418.jpg" },
      { name: "Cheese Fries", price: "EGP 95", image: "https://media.alimento.io/items/45/17467495569817093.jpg" },
    ],
  },
  {
    name: "Desserts & Bakeries",
    items: [
      { name: "Mini Pancake (10 pcs)", price: "EGP 90", image: "https://media.alimento.io/items/45/17315809602303114.jpg" },
      { name: "Mini Pancake (15 pcs)", price: "EGP 120", image: "https://media.alimento.io/items/45/17315809701452016.jpg" },
      { name: "Chocolate Fudge Cake", price: "EGP 140", image: "https://media.alimento.io/items/45/17467500953975713.jpg" },
      { name: "Cheese Cake", price: "EGP 100", image: "https://media.alimento.io/items/45/17467502548717226.jpg" },
      { name: "Pistachio Cheese Cake", price: "EGP 120", image: "https://media.alimento.io/items/45/17467502548717226.jpg" },
      { name: "Carrot Cake", price: "EGP 120", image: "https://media.alimento.io/items/45/17315335353084150.png" },
      { name: "Honey Cake", price: "EGP 110", image: "https://media.alimento.io/items/45/17467497626055821.jpg" },
      { name: "Oreo Chocolate Mousse", price: "EGP 110", image: "https://media.alimento.io/items/45/17467500953975713.jpg" },
      { name: "Volcano Cake", price: "EGP 110", image: "https://media.alimento.io/items/45/17467500953975713.jpg" },
      { name: "Molten Nutella Cake", price: "EGP 110", image: "https://media.alimento.io/items/45/17467500953975713.jpg" },
      { name: "Plain Croissant", price: "EGP 60", image: "https://media.alimento.io/items/45/17467509967583108.jpg" },
      { name: "Cheddar Turkey Croissant", price: "EGP 95", image: "https://media.alimento.io/items/45/17315337958050265.png" },
      { name: "Apple Muffin", price: "EGP 65", image: "https://media.alimento.io/items/45/17467515287551006.jpg" },
      { name: "Chocolate Muffin", price: "EGP 65", image: "https://media.alimento.io/items/45/17467513433107615.webp" },
      { name: "Chocolate Cookies", price: "EGP 60", image: "https://media.alimento.io/items/45/17467513433107615.webp" },
      { name: "English Cake", price: "EGP 60", image: "https://media.alimento.io/items/45/17467513433107615.webp" },
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
