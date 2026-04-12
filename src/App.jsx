import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/home";
import Food from "./pages/food";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import RestaurantsPage from "./pages/restaurants";
import RestaurantDetailsPage from "./pages/restaurant-details";
import ProfilePage from "./pages/profile";
import OrdersPage from "./pages/orders";
import DealsPage from "./pages/deals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import { restoreUserFromStorage } from "./redux/userSlice";
import { getCurrentUser, getAddresses, getFavorites, initializeAdminUser } from "./lib/storage";

export default function App() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart || []);

  // Restore user from localStorage on app mount
  useEffect(() => {
    // Initialize admin user on first load
    initializeAdminUser();

    const { user, isLoggedIn } = getCurrentUser();
    const addresses = getAddresses();
    const favorites = getFavorites();

    if (isLoggedIn && user) {
      dispatch(
        restoreUserFromStorage({
          user,
          isLoggedIn,
          addresses,
          favorites
        })
      );
      console.log("✅ User restored:", user.email);
    }
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Navbar cartCount={cartItems.reduce((total, item) => total + (item.qty || 1), 0)} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/restaurant/:restaurantId" element={<RestaurantDetailsPage />} />
          <Route path="/food" element={<Food />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/deals" element={<DealsPage />} />
        </Routes>

        <Footer />
      </Router>
    </div>
  );
}

