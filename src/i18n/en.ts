export const en = {
  // Navigation
  nav: {
    menu: "Menu",
    reservations: "Reservations",
    locations: "Locations",
    about: "About",
    orderNow: "Order Now",
  },
  
  // Hero Section
  hero: {
    tagline: "Specialty coffee, artisan sandwiches & good vibes",
    exploreMenu: "Explore Menu",
    orderOnTalabat: "Order on Talabat",
  },
  
  // Menu Section
  menu: {
    title: "Our Menu",
    subtitle: "Crafted with love, served with passion",
    searchPlaceholder: "Search menu...",
    filters: {
      all: "All",
      new: "New",
      topRated: "Top Rated",
      spicy: "Spicy",
    },
    dietary: {
      title: "Dietary",
      vegan: "Vegan",
      vegetarian: "Vegetarian",
      glutenFree: "Gluten Free",
      dairyFree: "Dairy Free",
      sugarFree: "Sugar Free",
    },
    noResults: "No items found",
    addToOrder: "Add to Order",
    currency: "EGP",
  },
  
  // Reservation Section
  reservation: {
    title: "Make a Reservation",
    subtitle: "Choose your preferred way to experience Shayboub",
    header: "Reserve Your Spot",
    serviceType: {
      title: "How would you like to visit us?",
      dineIn: "Dine In",
      dineInDesc: "Reserve a table",
      pickup: "Pickup",
      pickupDesc: "Book pickup time",
    },
    location: {
      title: "Location",
      cairo: "Cairo - New Cairo (El-Moshir Tantawy)",
      alexKafr: "Alexandria - Kafr Abdou",
      alexGleem: "Alexandria - Gleem (El Raml)",
    },
    date: "Date",
    time: "Time",
    partySize: "Party Size",
    person: "person",
    people: "people",
    guests: "Number of Guests",
    guest: "Guest",
    guestsPlural: "Guests",
    name: "Your Name",
    namePlaceholder: "Full name",
    nameRequired: "*",
    phone: "Phone Number",
    phonePlaceholder: "+20 1xx xxx xxxx",
    email: "Email Address",
    emailOptional: "(Optional)",
    emailPlaceholder: "you@email.com",
    specialRequests: "Special Requests or Notes",
    specialRequestsPlaceholder: "Allergies, birthday setup, highchair needed...",
    preOrder: {
      title: "Pre-Order Menu Items",
      subtitle: "Enhance your experience by pre-ordering your favorite items with your reservation",
      addItems: "Browse Menu & Select Items",
      closeMenu: "Close Menu Selection",
      cart: "Cart",
      items: "items",
      total: "Total",
      empty: "No items added",
      searchPlaceholder: "Search menu items...",
      noItemsFound: "No items found",
      noItems: "No items found",
      add: "Add",
      decrease: "Decrease",
      increase: "Increase",
      benefits: {
        fresh: "Prepared Fresh",
        ready: "Ready on Arrival",
        efficient: "Time Efficient",
      },
      medium: "Medium",
      large: "Large",
      selectSize: "Select Size",
    },
    summary: {
      title: "Reservation Summary",
      service: "Service",
      location: "Location",
      dateTime: "Date & Time",
      guests: "Guests",
      guest: "Guest",
      preOrder: "Pre-ordered Items",
      preorderedItems: "Pre-ordered Items",
      total: "Total",
      dineIn: "Dine-In",
      pickup: "Pickup",
    },
    submitButton: "Submit Reservation",
    submit: "Confirm Reservation",
    submitting: "Submitting...",
    items: "items",
    confirmationNote: "We'll confirm your booking within the next hour",
    success: {
      title: "Reservation Submitted!",
      message: "Thank you for your reservation!",
      pickupMessage: "Thank you for your booking!",
      confirmMessage: "We'll confirm your booking via phone within the next hour.",
    },
    errors: {
      name: "Name is required",
      phone: "Phone number is required",
      date: "Date is required",
      time: "Time is required",
    },
    toast: {
      successTitle: "Success! 🎉",
      successMessage: "Your reservation has been submitted. We'll confirm via phone shortly.",
      errorTitle: "Error",
      errorMessage: "Failed to submit. Please try again.",
    },
  },
  
  // Locations Section
  locations: {
    title: "Our Locations",
    subtitle: "Find us across Cairo & Alexandria",
    cairo: {
      name: "Cairo - New Cairo",
      address: "New Cairo, 5th Settlement",
    },
    alexSmouha: {
      name: "Alexandria - Smouha",
      address: "Smouha, Alexandria",
    },
    alexSidiGaber: {
      name: "Alexandria - Sidi Gaber",
      address: "Sidi Gaber, Alexandria",
    },
    getDirections: "Get Directions",
    workingHours: "Working Hours",
    dailyHours: "Daily: 8 AM - 12 AM",
  },
  
  // About Section
  about: {
    title: "About Shayboub",
    subtitle: "Our Story",
    description: "Since 2017, Shayboub has been serving specialty coffee and artisan sandwiches with love. What started as a small café has grown into a beloved destination across Cairo and Alexandria.",
    stats: {
      rating: "Rating",
      reviews: "Reviews",
      locations: "Locations",
    },
    values: {
      quality: "Quality First",
      qualityDesc: "Premium ingredients, expertly crafted",
      community: "Community",
      communityDesc: "More than a café, a gathering place",
      passion: "Passion",
      passionDesc: "Every cup tells a story",
    },
  },
  
  // Footer
  footer: {
    tagline: "Specialty Coffee & More",
    copyright: "All rights reserved.",
    links: {
      menu: "Menu",
      locations: "Locations",
      about: "About",
      talabat: "Talabat",
    },
    social: {
      facebook: "Facebook",
      instagram: "Instagram",
    },
  },
  
  // Common
  common: {
    loading: "Loading...",
    error: "Something went wrong",
    close: "Close",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    remove: "Remove",
    search: "Search",
    filter: "Filter",
    clear: "Clear",
    viewAll: "View All",
    seeMore: "See More",
    seeLess: "See Less",
    optional: "Optional",
  },

  // Admin Panel
  admin: {
    title: "Admin Panel",
    nav: {
      dashboard: "Dashboard",
      analytics: "Analytics",
      menu: "Menu Management",
      reservations: "Reservations",
      calendar: "Calendar View",
      staff: "Staff Management",
      viewWebsite: "View Website →",
    },
    logout: "Logout",
  },
};

export type Translations = typeof en;
