import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { m } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/userSlice";
import { verifyLogin } from "../lib/storage";
import { validateLogin } from "../lib/validation";

const emojis = ["🍕", "🍔", "🥤", "🍟", "🌮", "🍦"];

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loginSuccess, setLoginSuccess] = useState(false);
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

    // Validate form
    const validation = validateLogin(form);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    // Try to verify login
    const result = verifyLogin(form.email, form.password);
    if (!result.success) {
      setError("❌ " + result.message);
      return;
    }

    // Login successful
    dispatch(login(result.user));
    setLoginSuccess(true);

    setTimeout(() => {
      navigate("/profile");
    }, 1500);
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
                ⚠️ {error}
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
                  /* Changed p-4 to py-6 px-4 for a taller, cleaner look */
                  className="py-6 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white transition-all"
                />
              </div>

              <div>
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  /* Changed p-4 to py-6 px-4 */
                  className="py-6 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white transition-all"
                />
              </div>

              <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  /* Removed conflicting p-5 and py-3. Used py-6 for matching thickness */
                  className="w-full py-6 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl text-lg shadow-lg transition-all"
                >
                  Login
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
