import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { m } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/userSlice";
import { registerUser } from "../lib/storage";
import { validateSignup } from "../lib/validation";

const emojis = ["🍕", "🍔", "🥤", "🍟", "🌮", "🍦"];

export default function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields are filled
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("❌ Please fill all fields");
      return;
    }

    // Validate using utility function
    const validation = validateSignup(form);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    // Try to register user
    const result = registerUser({
      name: form.name,
      email: form.email,
      phone: "",
    });

    if (!result.success) {
      setError("❌ " + result.message);
      return;
    }

    // Signup successful
    dispatch(login(result.user));
    setSignupSuccess(true);

    setTimeout(() => {
      navigate("/profile");
    }, 1500);
  };

  if (signupSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-green-400 via-emerald-500 to-teal-600 p-4">
        <m.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="bg-white p-8 rounded-2xl shadow-2xl text-center"
        >
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-green-600 mb-2">
            Account Created!
          </h2>
          <p className="text-gray-600">Welcome to FoodRush! 🍽️</p>
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
          <div className="h-2" />
          <CardContent className="p-8">
            <h2 className="text-3xl font-black text-center mb-1">
              <span className="bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Create Account
              </span>
            </h2>
            <p className="text-gray-500 text-center mb-6">
              Join FoodRush and start ordering!
            </p>
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 font-semibold">
                ⚠️ {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Input */}
              <div>
                <Input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full py-6 px-4 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:border-orange-500 transition-all outline-none"
                />
              </div>

              {/* Email Address Input */}
              <div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full py-6 px-4 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:border-orange-500 transition-all outline-none"
                />
              </div>

              {/* Password Input */}
              <div>
                <Input
                  name="password"
                  type="password"
                  placeholder="Password (min 6 chars)"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full py-6 px-4 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:border-orange-500 transition-all outline-none"
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full py-6 px-4 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:border-orange-500 transition-all outline-none"
                />
              </div>

              {/* Thickened Submit Button */}
              <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full py-6 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl text-lg shadow-lg transition-all"
                >
                  Create Account
                </Button>
              </m.div>
            </form>
            <p className="text-center text-gray-500 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-orange-600 font-bold hover:text-orange-700 transition-colors"
              >
                Login Here →
              </Link>
            </p>
          </CardContent>
        </Card>
      </m.div>
    </div>
  );
}
