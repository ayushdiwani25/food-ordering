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

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);

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
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-yellow-500 via-orange-500 to-red-500 p-4">
        <m.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-2xl text-center"
        >
          <div className="text-6xl mb-4 animate-bounce">✅</div>
          <h2 className="text-3xl font-bold text-green-600 mb-2">Login Successful!</h2>
          <p className="text-gray-600">Welcome back! 🎉</p>
        </m.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-yellow-200 via-orange-300 to-red-300 p-4">
      <m.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-2xl bg-white/95 backdrop-blur-md border-2 border-orange-200">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-orange-600 text-center mb-2">
              Welcome Back 👋
            </h2>
            <p className="text-gray-600 text-center mb-6">Login to your account</p>

            {error && (
              <div className="bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="pl-10 border-2 border-gray-300 focus:border-orange-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-lg transition transform hover:scale-105"
              >
                Login 🔓
              </Button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-orange-600 font-bold hover:underline">
                Sign Up Here
              </Link>
            </p>
          </CardContent>
        </Card>
      </m.div>
    </div>
  );
}
