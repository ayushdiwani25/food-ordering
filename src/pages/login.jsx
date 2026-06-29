import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { m } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/userSlice";
import { validateLogin } from "../lib/validation";

// 1. Import Firebase auth methods and your initialized config
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Adjust this path to match your firebase.js location

const emojis = ["🍕", "🍔", "🥤", "🍟", "🌮", "🍦"];

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added a loading state for network request

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/profile");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // 2. Turn the submit handler async to await the Firebase network call
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form structures locally first
    const validation = validateLogin(form);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 3. Authenticate with Firebase live backend
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const firebaseUser = userCredential.user;

      // 4. Construct user object for your Redux store
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || "User",
      };

      // Login successful
      dispatch(login(userData));
      setLoginSuccess(true);

      setTimeout(() => {
        navigate("/profile");
      }, 1500);

    } catch (err) {
      // 5. Catch Firebase specific errors cleanly
      console.error("Firebase auth error:", err.code);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("❌ Invalid email or password.");
      } else if (err.code === "auth/too-many-requests") {
        setError("⚠️ Access temporarily disabled due to many failed attempts. Try again later.");
      } else {
        setError("❌ Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loginSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-400 via-yellow-400 to-green-400 p-4">
        <m.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="bg-white p-8 rounded-2xl shadow-2xl text-center"
        >
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-green-600 mb-2">
            Login Successful!
          </h2>
          <p className="text-gray-600">Welcome back! 🔓</p>
        </m.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-100 via-orange-200 to-red-200 p-4 relative overflow-hidden">
      {/* Floating food emojis */}
      {emojis.map((emoji, i) => (
        <m.div
          key={i}
          className="absolute text-4xl opacity-15 select-none pointer-events-none"
          style={{ left: `${15 + i * 14}%`, top: `${10 + (i % 3) * 35}%` }}
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.3 }}
        >
          {emoji}
        </m.div>
      ))}

      <m.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="rounded-2xl shadow-2xl bg-white/95 backdrop-blur-md border-2 border-orange-200 overflow-hidden">
          <div className="h-2 bg-linear-to-r" />
          <CardContent className="p-8">
            <h2 className="text-3xl font-black text-center mb-1">
              <span className="bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Welcome Back
              </span>
            </h2>
            <p className="text-gray-500 text-center mb-6">
              Login to your account
            </p>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="py-6 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="py-6 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white transition-all disabled:opacity-50"
                />
              </div>

              <m.div whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl text-lg shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </m.div>
            </form>
            <p className="text-center text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-orange-600 font-bold hover:text-orange-700 transition-colors"
              >
                Sign Up Here →
              </Link>
            </p>
          </CardContent>
        </Card>
      </m.div>
    </div>
  );
}