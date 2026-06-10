import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Top Section - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
                alt="FoodRush Logo"
                className="w-10 h-10"
              />
              <h2 className="text-2xl font-bold text-orange-500">FoodRush</h2>
            </div>
            <p className="text-gray-400 text-sm">
              Delivering happiness to your doorstep. Fresh food, fast service!
            </p>

          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-orange-400 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-orange-400">Home</Link></li>
              <li><Link to="/food" className="text-gray-400 hover:text-orange-400">Menu</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-orange-400">Cart</Link></li>
          
            </ul>
          </div>


          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-orange-400 mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📞 +91 (555) 123-4567</li>
              <li>✉️ hello@foodrush.com</li>
              <li>📍 123 Food Street, City</li>
              <li>🕐 9 AM - 11 PM Daily</li>
            </ul>
          </div>

        </div>

        {/* Newsletter Section */}
        <div className="bg-orange-600 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-2">Subscribe to our Newsletter</h3>
          <p className="text-orange-100 text-sm mb-4">Get exclusive offers and updates!</p>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p className="text-center md:text-left">&copy; {currentYear} FoodRush. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="text-gray-400">Privacy Policy</span>
            <span className="text-gray-400">Terms of Service</span>
            <span className="text-gray-400">Cookies</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
