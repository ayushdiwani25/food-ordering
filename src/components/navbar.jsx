import React from "react";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";

// ===== HELPER: Navigation Links Data =====
const NAVBAR_LINKS = [
  { path: "/", label: "🏠 Home" },
  { path: "/restaurants", label: "🍽️ Restaurants" },
  { path: "/food", label: "🍕 Menu" },
  { path: "/deals", label: "🎉 Deals" }
];

// ===== HELPER: Navigation Link Component =====
function NavbarLink({ path, label }) {
  return (
    <li>
      <NavLink
        to={path}
        className={({ isActive }) =>
          `font-bold text-base transition-all ${
            isActive ? "text-white" : "text-white/80 hover:text-white"
          }`
        }
      >
        <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          {label}
        </motion.span>
      </NavLink>
    </li>
  );
}

// ===== HELPER: User Avatar or Login Button =====
function UserSection({ user, isLoggedIn }) {
  if (isLoggedIn && user) {
    return (
      <Link
        to="/profile"
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition transform hover:scale-110 shadow-sm"
        title={`${user.name} - Click to view profile`}
      >
        <motion.div
          className="w-8 h-8 bg-linear-to-r from-yellow-300 to-orange-400 text-white rounded-full flex items-center justify-center font-bold text-sm"
          whileHover={{ scale: 1.2 }}
        >
          {user.name?.charAt(0).toUpperCase() || "A"}
        </motion.div>
        <span className="text-sm font-semibold hidden md:inline">
          {user.name?.split(" ")[0]}
        </span>
      </Link>
    );
  }

  return (
    <Link
      to="/login"
      className="px-4 py-2 rounded-full bg-orange-100 hover:bg-orange-200 transition transform hover:scale-110 shadow-sm"
      title="Login"
    >
      <svg
        className="w-6 h-6 text-orange-700"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a8.5 8.5 0 0113 0" />
      </svg>
    </Link>
  );
}

export default function Navbar({ cartCount }) {
  const { user, isLoggedIn } = useSelector(state => state.user);

  return (
    <nav className="sticky top-0 z-50 bg-linear-to-r from-orange-500 via-orange-400 to-red-500 text-white shadow-lg">
      <div className="flex items-center justify-between px-8 py-4">

        {/* Logo */}
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
            alt="logo"
            className="w-12 h-12"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          />
          <motion.h1 className="text-3xl font-black">FoodRush</motion.h1>
        </motion.div>

        {/* Navigation Links */}
        <ul className="flex gap-8">
          {NAVBAR_LINKS.map(({ path, label }) => (
            <NavbarLink key={path} path={path} label={label} />
          ))}
        </ul>

        {/* Right Section: Cart + Orders + User */}
        <div className="flex items-center gap-4">

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2 rounded-full bg-orange-100 hover:bg-orange-200 transition transform hover:scale-110"
            title="View Cart"
          >
            <svg
              className="w-6 h-6 text-orange-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 9h18l-1 10H4L3 9z" />
              <path d="M9 9V6a3 3 0 016 0v3" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Orders Icon */}
          <Link
            to="/orders"
            className="p-2 rounded-full bg-orange-100 hover:bg-orange-200 transition transform hover:scale-110"
            title="My Orders"
          >
            <svg
              className="w-6 h-6 text-orange-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 7h6m0 10v-3m-6 3v-3m-6-4h18a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2z" />
            </svg>
          </Link>

          {/* User Section */}
          <UserSection user={user} isLoggedIn={isLoggedIn} />

        </div>
      </div>
    </nav>
  );
}