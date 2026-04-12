import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriteRestaurants: [],
  favoriteItems: []
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavoriteRestaurant: (state, action) => {
      if (!state.favoriteRestaurants.find(r => r.id === action.payload.id)) {
        state.favoriteRestaurants.push(action.payload);
      }
    },
    removeFavoriteRestaurant: (state, action) => {
      state.favoriteRestaurants = state.favoriteRestaurants.filter(
        r => r.id !== action.payload
      );
    },
    addFavoriteItem: (state, action) => {
      if (!state.favoriteItems.find(i => i.id === action.payload.id)) {
        state.favoriteItems.push(action.payload);
      }
    },
    removeFavoriteItem: (state, action) => {
      state.favoriteItems = state.favoriteItems.filter(
        i => i.id !== action.payload
      );
    },
    clearFavorites: (state) => {
      state.favoriteRestaurants = [];
      state.favoriteItems = [];
    }
  }
});

export const {
  addFavoriteRestaurant,
  removeFavoriteRestaurant,
  addFavoriteItem,
  removeFavoriteItem,
  clearFavorites
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
