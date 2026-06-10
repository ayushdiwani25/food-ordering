import { createSlice } from "@reduxjs/toolkit";
import { 
  saveAddresses,
  logoutUser
} from "../lib/storage";

const initialState = {
  user: null,
  isLoggedIn: false,
  addresses: [],
  selectedAddress: null,
  favorites: []
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Login user
    login: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },

    // Logout user
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.addresses = [];
      state.selectedAddress = null;
      state.favorites = [];
      logoutUser();
    },

    // Restore user from localStorage on app start
    restoreUserFromStorage: (state, action) => {
      state.user = action.payload.user;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.addresses = action.payload.addresses || [];
      state.favorites = action.payload.favorites || [];
    },

    // Add address
    addAddress: (state, action) => {
      state.addresses.push(action.payload);
      saveAddresses(state.addresses);
    },

    // Delete address
    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
      saveAddresses(state.addresses);
    },

    // Select address
    selectAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },

    // Update user profile
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  }
});

export const {
  login,
  logout,
  restoreUserFromStorage,
  addAddress,
  deleteAddress,
  selectAddress,
  updateProfile
} = userSlice.actions;

export default userSlice.reducer;
