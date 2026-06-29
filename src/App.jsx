import React, { useEffect, useState } from "react";
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
import { AnimatePresence, MotionConfig, LazyMotion, m, domAnimation } from "framer-motion";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";

// Firebase imports
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { restoreUserFromStorage } from "./redux/userSlice";

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch full profile from Firestore (name, phone, isAdmin, addresses, etc.)
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          let userProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || "User",
            isAdmin: false,
            phone: "",
            memberSince: "",
          };

          let addresses = [];

          if (userDocSnap.exists()) {
            const firestoreData = userDocSnap.data();
            userProfile = {
              ...userProfile,
              ...firestoreData,
            };
            addresses = firestoreData.addresses || [];
          }

          dispatch(
            restoreUserFromStorage({
              user: userProfile,
              isLoggedIn: true,
              addresses,
              favorites: userProfile.favorites || [],
            })
          );
        } catch (error) {
          console.error("Error fetching user profile from Firestore:", error);
          // Fallback to basic Firebase Auth data
          dispatch(
            restoreUserFromStorage({
              user: {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || "User",
              },
              isLoggedIn: true,
              addresses: [],
              favorites: [],
            })
          );
        }
      } else {
        // No authenticated session
        dispatch(
          restoreUserFromStorage({
            user: null,
            isLoggedIn: false,
            addresses: [],
            favorites: [],
          })
        );
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="App flex flex-col min-h-screen">
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation}>
          <Router>
            <Navbar cartCount={cartItems.reduce((total, item) => total + (item.qty || 1), 0)} />
            <main className="flex-1 flex flex-col">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                  <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
                  <Route path="/signup" element={<PageTransition><SignupPage /></PageTransition>} />
                  <Route path="/restaurants" element={<PageTransition><RestaurantsPage /></PageTransition>} />
                  <Route path="/restaurant/:restaurantId" element={<PageTransition><RestaurantDetailsPage /></PageTransition>} />
                  <Route path="/food" element={<PageTransition><Food /></PageTransition>} />
                  <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
                  <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
                  <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
                  <Route path="/orders" element={<PageTransition><OrdersPage /></PageTransition>} />
                  <Route path="/deals" element={<PageTransition><DealsPage /></PageTransition>} />
                  <Route path="/admin/restaurants" element={<PageTransition><RestaurantAdminPanel /></PageTransition>} />
                </Routes>
              </AnimatePresence>
            </main>
            <Footer />
          </Router>
        </LazyMotion>
      </MotionConfig>
    </div>
  );
}