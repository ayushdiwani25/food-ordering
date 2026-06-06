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
import RestaurantAdminPanel from "./pages/admin-panel";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence, MotionConfig, LazyMotion, m, domAnimation } from "framer-motion";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import { restoreUserFromStorage } from "./redux/userSlice";
import { getCurrentUser, getAddresses, getFavorites, initializeAdminUser } from "./lib/storage";

// Page transition wrapper component
const PageTransition = ({ children }) => (
  <m.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    {children}
  </m.div>
);

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
    }
  }, [dispatch]);

  return (
    <div className="App">
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation}>
          <Router>
            <Navbar cartCount={cartItems.reduce((total, item) => total + (item.qty || 1), 0)} />
            <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PageTransition>
                  <SignupPage />
                </PageTransition>
              } 
            />
            <Route 
              path="/restaurants" 
              element={
                <PageTransition>
                  <RestaurantsPage />
                </PageTransition>
              } 
            />
            <Route 
              path="/restaurant/:restaurantId" 
              element={
                <PageTransition>
                  <RestaurantDetailsPage />
                </PageTransition>
              } 
            />
            <Route 
              path="/food" 
              element={
                <PageTransition>
                  <Food />
                </PageTransition>
              } 
            />
            <Route 
              path="/cart" 
              element={
                <PageTransition>
                  <Cart />
                </PageTransition>
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <PageTransition>
                  <Checkout />
                </PageTransition>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PageTransition>
                  <ProfilePage />
                </PageTransition>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <PageTransition>
                  <OrdersPage />
                </PageTransition>
              } 
            />
            <Route 
              path="/deals" 
              element={
                <PageTransition>
                  <DealsPage />
                </PageTransition>
              } 
            />
            <Route 
              path="/admin/restaurants" 
              element={
                <PageTransition>
                  <RestaurantAdminPanel />
                </PageTransition>
              } 
            />
          </Routes>
            </AnimatePresence>
            <Footer />
          </Router>
        </LazyMotion>
      </MotionConfig>
    </div>
  );
}

