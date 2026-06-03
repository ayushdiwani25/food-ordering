import { createSlice } from "@reduxjs/toolkit";
import { 
  saveRestaurantItems,
  getRestaurantItems,
  saveAllRestaurants
} from "../lib/storage";

const initialState = {
  restaurants: [],
  currentRestaurant: null,
  items: []
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    // Set current restaurant
    setCurrentRestaurant: (state, action) => {
      state.currentRestaurant = action.payload;
      state.items = getRestaurantItems(action.payload.id) || [];
    },

    // Load restaurant items
    loadRestaurantItems: (state, action) => {
      state.items = action.payload;
    },

    // Add new item to restaurant menu
    addItem: (state, action) => {
      const newItem = {
        id: Date.now(),
        ...action.payload,
        restaurantId: state.currentRestaurant?.id,
        createdAt: new Date().toISOString()
      };
      state.items.push(newItem);
      saveRestaurantItems(state.currentRestaurant?.id, state.items);
    },

    // Update existing item
    updateItem: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload,
          updatedAt: new Date().toISOString()
        };
        saveRestaurantItems(state.currentRestaurant?.id, state.items);
      }
    },

    // Delete item from menu
    deleteItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveRestaurantItems(state.currentRestaurant?.id, state.items);
    },

    // Set all restaurants
    setRestaurants: (state, action) => {
      state.restaurants = action.payload;
    },

    // Update restaurant info
    updateRestaurantInfo: (state, action) => {
      if (state.currentRestaurant) {
        state.currentRestaurant = { ...state.currentRestaurant, ...action.payload };
        const index = state.restaurants.findIndex(r => r.id === state.currentRestaurant.id);
        if (index !== -1) {
          state.restaurants[index] = state.currentRestaurant;
          saveAllRestaurants(state.restaurants);
        }
      }
    }
  }
});

export const {
  setCurrentRestaurant,
  loadRestaurantItems,
  addItem,
  updateItem,
  deleteItem,
  setRestaurants,
  updateRestaurantInfo
} = restaurantSlice.actions;

export default restaurantSlice.reducer;
