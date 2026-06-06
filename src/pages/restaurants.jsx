import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { m } from "framer-motion";
import { RESTAURANTS, DEALS } from "../data";
import SearchComponent from "../components/search";

export default function RestaurantsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRestaurants = RESTAURANTS.filter((restaurant) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      restaurant.name.toLowerCase().includes(searchLower) ||
      restaurant.cuisines.some(cuisine => cuisine.toLowerCase().includes(searchLower)) ||
      restaurant.location.toLowerCase().includes(searchLower) ||
      restaurant.description.toLowerCase().includes(searchLower)
    );
  });

  const handleSearch = (item, type) => {
    if (type === "restaurants") {
      navigate(`/restaurant/${item.id}`);
    } else if (typeof item === "string") {
      setSearchQuery(item);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            Order from Top Restaurants
          </h1>
          <p className="text-gray-600 text-lg">
            Discover the best restaurants and cuisines near you
          </p>
        </m.div>

        {/* Search */}
        <div className="mb-8">
          <SearchComponent onSearch={handleSearch} />
        </div>

        {/* Deals Section */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Special Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEALS.map(deal => (
              <div
                key={deal.id}
                className="bg-linear-to-r from-orange-400 to-red-400 rounded-lg p-4 text-white shadow-lg hover:shadow-xl transition"
              >
                <h3 className="font-bold text-xl mb-2">{deal.title}</h3>
                <p className="text-sm mb-2">{deal.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{deal.discount}% OFF</span>
                  <span className="text-xs opacity-75">Valid till {deal.validTill}</span>
                </div>
              </div>
            ))}
          </div>
        </m.div>

         {/* Restaurants Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredRestaurants.length > 0 ? (
             filteredRestaurants.map((restaurant, index) => (
            <m.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer transform hover:scale-105"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48 bg-gray-200">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {restaurant.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center text-yellow-500 font-semibold">
                    ⭐ {restaurant.rating}
                  </span>
                  <span className="text-gray-600 text-sm">
                    • {restaurant.cuisines.join(", ")}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <span>🚚 ₹{restaurant.deliveryFee} delivery</span>
                  <span>⏱️ {restaurant.deliveryTime}</span>
                </div>

                {!restaurant.isOpen && (
                  <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-semibold">
                    Currently Closed
                  </div>
                )}
              </div>
            </m.div>
             ))
           ) : (
             <m.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="col-span-full text-center py-16"
             >
                <p className="text-2xl text-gray-600 font-bold mb-4">
                  No restaurants found for "{searchQuery}"
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-2 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600"
               >
                 Clear Search
               </button>
             </m.div>
           )}
         </div>
      </div>
    </div>
  );
}
