import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { m } from "framer-motion";
import { DEALS, PROMO_CODES, RESTAURANTS } from "../data";

export default function DealsPage() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyPromo = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            🎉 Special Deals & Offers
          </h1>
          <p className="text-gray-600 text-lg">
            Save big on your favorite restaurants and dishes
          </p>
        </m.div>

        {/* Promo Codes Section */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <span className="text-3xl">🎟️</span> Promo Codes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROMO_CODES.map(promo => (
              <m.div
                key={promo.code}
                whileHover={{ scale: 1.02 }}
                className="bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm opacity-90">Promo Code</p>
                    <p className="text-3xl font-bold">{promo.code}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyPromo(promo.code)}
                    className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-200 font-bold transition flex items-center gap-2"
                  >
                    {copiedCode === promo.code ? (
                      <>
                        <span>✓</span> Copied
                      </>
                    ) : (
                      <>
                         Copy
                      </>
                    )}
                  </button>
                </div>

                <p className="text-lg font-bold mb-2">
                  ₹{promo.discount} Off
                </p>
                <p className="text-sm opacity-90 mb-3">{promo.description}</p>
                <p className="text-xs opacity-75">
                  Min. order: ₹{promo.minOrder}
                </p>
              </m.div>
            ))}
          </div>
        </m.div>

        {/* Restaurant Deals */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <span className="text-3xl">🔥</span> Restaurant Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEALS.map((deal, index) => {
              const restaurant = RESTAURANTS.find(
                r => r.id === deal.restaurantId
              );
              return (
                <m.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  onClick={() => navigate(`/restaurant/${deal.restaurantId}`)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer transform hover:scale-105"
                >
                  <div className="relative h-40 bg-linear-to-r from-orange-400 to-red-400 flex items-center justify-center">
                    <div className="text-center text-white">
                      <p className="text-5xl font-black">{deal.discount}%</p>
                      <p className="text-lg font-bold">OFF</p>
                    </div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {deal.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{deal.description}</p>

                    {restaurant && (
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">At Restaurant</p>
                        <p className="font-semibold text-gray-800">
                          {restaurant.name}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {deal.validTill}
                      </span>
                      <button type="button" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold text-sm">
                        Order Now
                      </button>
                    </div>
                  </div>
                </m.div>
              );
            })}
          </div>
        </m.div>

        {/* How to Use */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            💡 How to Use Promo Codes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4">
              <p className="text-3xl mb-2">1️⃣</p>
              <h3 className="font-bold text-gray-800 mb-2">
                Add Items to Cart
              </h3>
              <p className="text-gray-600">
                Browse restaurants and add your favorite dishes to your cart
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-3xl mb-2">2️⃣</p>
              <h3 className="font-bold text-gray-800 mb-2">
                Copy the Promo Code
              </h3>
              <p className="text-gray-600">
                Click the copy button to copy any promo code from above
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-3xl mb-2">3️⃣</p>
              <h3 className="font-bold text-gray-800 mb-2">
                Apply at Checkout
              </h3>
              <p className="text-gray-600">
                Paste the code at checkout and enjoy your discount!
              </p>
            </div>
          </div>
        </m.div>
      </div>
    </div>
  );
}
