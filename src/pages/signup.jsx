import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/userSlice";
import { registerUser } from "../lib/storage";
import { validateSignup } from "../lib/validation";

export default function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
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
      phone: ""
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
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-500 via-pink-500 to-red-500 p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-2xl text-center"
        >
          <div className="text-6xl mb-4 animate-bounce">✨</div>
          <h2 className="text-3xl font-bold text-green-600 mb-2">Account Created!</h2>
          <p className="text-gray-600">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-yellow-200 via-orange-300 to-red-300 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-2xl bg-white/95 backdrop-blur-md border-2 border-orange-200">
          <CardContent className="p-8">
            <h2 className="text-3xl text-orange-600 font-bold text-center mb-2">
              Create Account ✨
            </h2>
            <p className="text-gray-600 text-center mb-6">Join FoodRush today</p>

            {error && (
              <div className="bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-3 text-orange-500" size={18} />
                <Input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="pl-10 border-2 border-gray-300 focus:border-orange-500"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3 text-orange-500" size={18} />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="pl-10 border-2 border-gray-300 focus:border-orange-500"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 text-orange-500" size={18} />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password (min 6 chars)"
                  value={form.password}
                  onChange={handleChange}
                  className="pl-10 border-2 border-gray-300 focus:border-orange-500"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 text-orange-500" size={18} />
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 border-2 border-gray-300 focus:border-orange-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-lg transition transform hover:scale-105"
              >
                Create Account ✅
              </Button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-orange-600 font-bold hover:underline">
                Login Here
              </Link>
            </p>

           
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
