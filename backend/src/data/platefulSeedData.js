
const foodPartners = [
  {
    businessName: "Spice Corner",
    ownerName: "Aarav Sharma",
    email: "spicecorner.demo@plateful.test",
    password: "SpiceDemo@123",
  },
  {
    businessName: "Burger House",
    ownerName: "Rohan Verma",
    email: "burgerhouse.demo@plateful.test",
    password: "BurgerDemo@123",
  },
  {
    businessName: "Pizza Hub",
    ownerName: "Ishita Gupta",
    email: "pizzahub.demo@plateful.test",
    password: "PizzaDemo@123",
  },
  {
    businessName: "Sweet Cravings",
    ownerName: "Ananya Mehta",
    email: "sweetcravings.demo@plateful.test",
    password: "SweetDemo@123",
  },
  {
    businessName: "Delhi Street Bites",
    ownerName: "Kabir Singh",
    email: "streetbites.demo@plateful.test",
    password: "StreetDemo@123",
  },
];

const foodItems = [
  // Spice Corner
  {
    foodPartnerName: "Spice Corner",
    name: "Paneer Butter Masala",
    description: "Paneer in rich, creamy tomato gravy.",
    price: 249,
    videoUrl: "http://localhost:3000/foodVideos/Paneer%20Butter%20Masala.mp4",
  },
  {
    foodPartnerName: "Spice Corner",
    name: "Veg Biryani",
    description: "Fragrant basmati rice with aromatic spices.",
    price: 199,
    videoUrl: "http://localhost:3000/foodVideos/Veg%20Biryani.mp4",
  },
  {
    foodPartnerName: "Spice Corner",
    name: "Chole Bhature",
    description: "Spiced chickpeas served with fluffy bhature.",
    price: 149,
    videoUrl: "http://localhost:3000/foodVideos/Chole%20bhature.mp4",
  },
  {
    foodPartnerName: "Spice Corner",
    name: "Masala Dosa",
    description: "Crispy dosa filled with seasoned potatoes.",
    price: 129,
    videoUrl: "http://localhost:3000/foodVideos/masala%20dosa.mp4",
  },

  // Burger House
  {
    foodPartnerName: "Burger House",
    name: "Classic Veg Burger",
    description: "Crispy veggie patty with fresh lettuce and sauce.",
    price: 119,
    videoUrl: "http://localhost:3000/foodVideos/veg%20burger.mp4",
  },
  {
    foodPartnerName: "Burger House",
    name: "Double Cheese Burger",
    description: "Juicy burger loaded with melted cheese.",
    price: 189,
    videoUrl: "http://localhost:3000/foodVideos/Double%20cheeze%20burger.mp4",
  },
  {
    foodPartnerName: "Burger House",
    name: "Peri Peri Fries",
    description: "Golden fries tossed in spicy peri peri seasoning.",
    price: 99,
    videoUrl: "http://localhost:3000/foodVideos/peri%20peri%20fries.mp4",
  },
  {
    foodPartnerName: "Burger House",
    name: "Paneer Tikka Wrap",
    description: "Grilled paneer wrapped with vegetables and mint sauce.",
    price: 159,
    videoUrl: "http://localhost:3000/foodVideos/paneer%20tikka%20wrap.mp4",
  },

  // Pizza Hub
  {
    foodPartnerName: "Pizza Hub",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce and melted cheese.",
    price: 199,
    videoUrl: "http://localhost:3000/foodVideos/Margherita%20Pizza.mp4",
  },
  {
    foodPartnerName: "Pizza Hub",
    name: "Farmhouse Pizza",
    description: "Pizza topped with capsicum, onion, and tomato.",
    price: 299,
    videoUrl: "http://localhost:3000/foodVideos/farmhouse%20pizza.mp4",
  },
  {
    foodPartnerName: "Pizza Hub",
    name: "Cheese Garlic Bread",
    description: "Toasted garlic bread topped with herbs and cheese.",
    price: 129,
    videoUrl: "http://localhost:3000/foodVideos/cheese%20garlic%20bread.mp4",
  },
  {
    foodPartnerName: "Pizza Hub",
    name: "White Sauce Pasta",
    description: "Creamy pasta with herbs and vegetables.",
    price: 219,
    videoUrl: "http://localhost:3000/foodVideos/white%20sauce%20pasta.mp4",
  },

  // Sweet Cravings
  {
    foodPartnerName: "Sweet Cravings",
    name: "Chocolate Brownie",
    description: "Rich chocolate brownie with a fudgy centre.",
    price: 99,
    videoUrl: "http://localhost:3000/foodVideos/Chocolate%20Brownie.mp4",
  },
  {
    foodPartnerName: "Sweet Cravings",
    name: "Red Velvet Cake",
    description: "Soft red velvet cake with creamy frosting.",
    price: 149,
    videoUrl: "http://localhost:3000/foodVideos/Red%20velvet.mp4",
  },
  {
    foodPartnerName: "Sweet Cravings",
    name: "Chocolate Cupcake",
    description: "Chocolate cupcake finished with smooth frosting.",
    price: 79,
    videoUrl: "http://localhost:3000/foodVideos/Chocolate%20Cupcake.mp4",
  },
  {
    foodPartnerName: "Sweet Cravings",
    name: "Chocolate Waffle",
    description: "Warm waffle drizzled with chocolate sauce.",
    price: 169,
    videoUrl: "http://localhost:3000/foodVideos/Chocolate%20Waffle.mp4",
  },

  // Delhi Street Bites
  {
    foodPartnerName: "Delhi Street Bites",
    name: "Veg Momos",
    description: "Steamed vegetable momos served with spicy chutney.",
    price: 99,
    videoUrl: "http://localhost:3000/foodVideos/Veg%20Momos.mp4",
  },
  {
    foodPartnerName: "Delhi Street Bites",
    name: "Tandoori Momos",
    description: "Smoky momos coated in tandoori spices.",
    price: 149,
    videoUrl: "http://localhost:3000/foodVideos/Tandoori%20Momos.mp4",
  },
  {
    foodPartnerName: "Delhi Street Bites",
    name: "Aloo Tikki Chaat",
    description: "Crispy potato patties topped with chutneys and curd.",
    price: 89,
    videoUrl: "http://localhost:3000/foodVideos/Aloo%20Tikki%20Chaat.mp4",
  },
  {
    foodPartnerName: "Delhi Street Bites",
    name: "Paneer Kathi Roll",
    description: "Spiced paneer wrapped with onions and chutney.",
    price: 139,
    videoUrl: "http://localhost:3000/foodVideos/Paneer%20Kathi%20Roll.mp4",
  },
];

module.exports = { foodPartners, foodItems };