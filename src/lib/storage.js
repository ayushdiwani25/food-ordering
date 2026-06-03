

const STORAGE_KEYS = {
  CURRENT_USER: "foodrush_currentUser",
  USERS_LIST: "foodrush_usersList",
  ISLOGGEDIN: "foodrush_isLoggedIn",
  ADDRESSES: "foodrush_addresses",
  FAVORITES: "foodrush_favorites"
};

// ====== ADMIN CREDENTIALS (FOR DEMO) ======
const ADMIN_CREDENTIALS = {
  email: "admin@gmail.com",
  password: "12345678",
  name: "admin"
};

// Initialize admin user on first load
export const initializeAdminUser = () => {
  try {
    const allUsers = getAllUsers();
    
    // If no admin user exists, create one
    const adminExists = allUsers.some(u => u.email === ADMIN_CREDENTIALS.email);
    
    if (!adminExists && allUsers.length === 0) {
      const adminUser = {
        id: "ADMIN-001",
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
        phone: "9999999999",
        isAdmin: true,
        memberSince: new Date().toLocaleDateString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      allUsers.push(adminUser);
      saveAllUsers(allUsers);
      console.log("✅ Admin user initialized:", adminUser.email);
    }
  } catch (error) {
    console.error("Error initializing admin:", error);
  }
};

// ====== USER FUNCTIONS ======

// Get all registered users from storage
const getAllUsers = () => {
  try {
    const users = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};

// Save updated users list to storage
const saveAllUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users:", error);
  }
};

// Register a new user (signup)
export const registerUser = (userData) => {
  try {
    const allUsers = getAllUsers();
    
    // Check if email already exists
    if (allUsers.some(u => u.email === userData.email)) {
      return { success: false, message: "Email already registered" };
    }

    // Create new user (WITHOUT password!)
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone || "",
      isAdmin: false,  // Regular users are NOT admins
      memberSince: new Date().toLocaleDateString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save user to list
    allUsers.push(newUser);
    saveAllUsers(allUsers);

    // Save as current user
    saveCurrentUser(newUser);

    return { success: true, user: newUser };
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, message: "Registration failed" };
  }
};

// Verify login - Check email and password
export const verifyLogin = (email, password) => {
  try {
    // Special handling for admin account
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // Find or create admin user
      let allUsers = getAllUsers();
      let user = allUsers.find(u => u.email === ADMIN_CREDENTIALS.email);
      
      if (!user) {
        // Create admin user if doesn't exist
        user = {
          id: "ADMIN-001",
          name: ADMIN_CREDENTIALS.name,
          email: ADMIN_CREDENTIALS.email,
          phone: "9999999999",
          isAdmin: true,
          memberSince: new Date().toLocaleDateString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        allUsers.push(user);
        saveAllUsers(allUsers);
      }
      
      // Save as current user
      saveCurrentUser(user);
      return { success: true, user };
    }

    // Regular user login
    const allUsers = getAllUsers();
    const user = allUsers.find(u => u.email === email);

    if (!user) {
      return { success: false, message: "Email not found. Please sign up first." };
    }

    // For regular users, just verify email exists (simplified demo)
    if (!password || password.length < 6) {
      return { success: false, message: "Invalid password" };
    }

    // Save as current user
    saveCurrentUser(user);

    return { success: true, user };
  } catch (error) {
    console.error("Error verifying login:", error);
    return { success: false, message: "Login failed" };
  }
};

// Save current logged-in user
const saveCurrentUser = (user) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.ISLOGGEDIN, "true");
  } catch (error) {
    console.error("Error saving current user:", error);
  }
};

// Get currently logged-in user
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    const isLoggedIn = localStorage.getItem(STORAGE_KEYS.ISLOGGEDIN);

    return {
      user: user ? JSON.parse(user) : null,
      isLoggedIn: isLoggedIn === "true"
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return { user: null, isLoggedIn: false };
  }
};

// Logout current user
export const logoutUser = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.ISLOGGEDIN);
    localStorage.removeItem(STORAGE_KEYS.ADDRESSES);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

// Check if email is already registered
export const isEmailRegistered = (email) => {
  const allUsers = getAllUsers();
  return allUsers.some(u => u.email === email);
};

// ====== ADDRESS FUNCTIONS ======

export const saveAddresses = (addresses) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses));
  } catch (error) {
    console.error("Error saving addresses:", error);
  }
};

export const getAddresses = () => {
  try {
    const addresses = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
    return addresses ? JSON.parse(addresses) : [];
  } catch (error) {
    console.error("Error getting addresses:", error);
    return [];
  }
};

// ====== FAVORITES FUNCTIONS ======

export const saveFavorites = (favorites) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites:", error);
  }
};

export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
};

// Check if a user is admin
export const isUserAdmin = (user) => {
  return user && user.isAdmin === true;
};

// ====== RESTAURANT FUNCTIONS ======

const RESTAURANT_STORAGE_KEY = "foodrush_restaurants";
const RESTAURANT_ITEMS_PREFIX = "foodrush_restaurant_items_";

// Save all restaurants
export const saveAllRestaurants = (restaurants) => {
  try {
    localStorage.setItem(RESTAURANT_STORAGE_KEY, JSON.stringify(restaurants));
  } catch (error) {
    console.error("Error saving restaurants:", error);
  }
};

// Get all restaurants
export const getAllRestaurants = () => {
  try {
    const restaurants = localStorage.getItem(RESTAURANT_STORAGE_KEY);
    return restaurants ? JSON.parse(restaurants) : [];
  } catch (error) {
    console.error("Error getting restaurants:", error);
    return [];
  }
};

// Save restaurant items/menu
export const saveRestaurantItems = (restaurantId, items) => {
  try {
    const key = `${RESTAURANT_ITEMS_PREFIX}${restaurantId}`;
    localStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving restaurant items:", error);
  }
};

// Get restaurant items/menu
export const getRestaurantItems = (restaurantId) => {
  try {
    const key = `${RESTAURANT_ITEMS_PREFIX}${restaurantId}`;
    const items = localStorage.getItem(key);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error("Error getting restaurant items:", error);
    return [];
  }
};

// Add or update single item
export const saveRestaurantItem = (restaurantId, item) => {
  try {
    const items = getRestaurantItems(restaurantId);
    const index = items.findIndex(i => i.id === item.id);
    if (index !== -1) {
      items[index] = item;
    } else {
      items.push(item);
    }
    saveRestaurantItems(restaurantId, items);
    return true;
  } catch (error) {
    console.error("Error saving restaurant item:", error);
    return false;
  }
};

// Delete restaurant item
export const deleteRestaurantItem = (restaurantId, itemId) => {
  try {
    const items = getRestaurantItems(restaurantId);
    const filtered = items.filter(i => i.id !== itemId);
    saveRestaurantItems(restaurantId, filtered);
    return true;
  } catch (error) {
    console.error("Error deleting restaurant item:", error);
    return false;
  }
};

// Get restaurant item by ID
export const getRestaurantItemById = (restaurantId, itemId) => {
  try {
    const items = getRestaurantItems(restaurantId);
    return items.find(i => i.id === itemId) || null;
  } catch (error) {
    console.error("Error getting restaurant item:", error);
    return null;
  }
};

export default {
  STORAGE_KEYS,
  registerUser,
  verifyLogin,
  getCurrentUser,
  logoutUser,
  isEmailRegistered,
  isUserAdmin,
  saveAddresses,
  getAddresses,
  saveFavorites,
  getFavorites,
  initializeAdminUser,
  saveAllRestaurants,
  getAllRestaurants,
  saveRestaurantItems,
  getRestaurantItems,
  saveRestaurantItem,
  deleteRestaurantItem,
  getRestaurantItemById
};
