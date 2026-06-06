import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { m } from "framer-motion";
import { RESTAURANTS, MENU } from "../data";

export default function SearchComponent({ onSearch }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("restaurants");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [vegFilter, setVegFilter] = useState("all"); // "all", "veg", "nonveg"

  // Helper function to check restaurant veg availability
  const getRestaurantVegStatus = (restaurant) => {
    const restaurantMenu = MENU.filter((item) =>
      restaurant.menu.includes(item.id)
    );

    const hasVegItems = restaurantMenu.some((item) => item.veg);
    const hasNonVegItems = restaurantMenu.some((item) => !item.veg);

    if (hasVegItems && !hasNonVegItems) return "veg"; // Only veg
    if (hasNonVegItems && !hasVegItems) return "nonveg"; // Only non-veg
    return "both"; // Both options
  };

  // Apply veg filter to restaurants
  const applyVegFilter = (restaurants) => {
    if (vegFilter === "all") return restaurants;

    return restaurants.filter((restaurant) => {
      const status = getRestaurantVegStatus(restaurant);
      if (vegFilter === "veg") return status === "veg" || status === "both";
      if (vegFilter === "nonveg") return status === "nonveg" || status === "both";
      return true;
    });
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      setResults(null);
      return;
    }

    const lowerValue = value.toLowerCase();

    if (activeTab === "restaurants") {
      // Get restaurant suggestions
      let restaurantSuggestions = RESTAURANTS.filter(
        (r) =>
          r.name.toLowerCase().includes(lowerValue) ||
          r.cuisines.some((c) => c.toLowerCase().includes(lowerValue)),
      ).slice(0, 5);
      // Apply veg filter
      restaurantSuggestions = applyVegFilter(restaurantSuggestions);

      setSuggestions(restaurantSuggestions);
      setShowSuggestions(restaurantSuggestions.length > 0);
    } else {
      // Get dish suggestions
      const dishSuggestions = MENU.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerValue) ||
          item.category.toLowerCase().includes(lowerValue),
      ).slice(0, 5); // Show max 5 suggestions

      setSuggestions(dishSuggestions);
      setShowSuggestions(dishSuggestions.length > 0);
    }
  };

  // Click on a suggestion
  const handleSuggestionClick = (item) => {
    setQuery(item.name);
    setSuggestions([]);
    setShowSuggestions(false);
    
    // Navigate to restaurant if it's a restaurant
    if (activeTab === "restaurants") {
      navigate(`/restaurant/${item.id}`);
    }
    
    // Call onSearch callback for other handling
    onSearch?.(item, activeTab);
  };

  const handleSearch = () => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const lowerQuery = query.toLowerCase();
    setShowSuggestions(false);

    if (activeTab === "restaurants") {
      let restaurantResults = RESTAURANTS.filter(
        (r) =>
          r.name.toLowerCase().includes(lowerQuery) ||
          r.cuisines.some((c) => c.toLowerCase().includes(lowerQuery)),
      );
      // Apply veg filter
      restaurantResults = applyVegFilter(restaurantResults);
      setResults({ type: "restaurants", data: restaurantResults });
    } else {
      const itemResults = MENU.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.category.toLowerCase().includes(lowerQuery) ||
          item.desc.toLowerCase().includes(lowerQuery),
      );
      setResults({ type: "items", data: itemResults });
    }
  };

  return (
    <div className="w-full mb-8">
      <div className="flex gap-2 mb-4 relative">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search restaurants or dishes..."
            value={query}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            onFocus={() =>
              query.trim() && suggestions.length > 0 && setShowSuggestions(true)
            }
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full px-4 py-3 border-2 border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <m.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-orange-300 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto"
            >
              {suggestions.map((item, index) => (
                <m.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(item)}
                  className="px-4 py-3 border-b border-gray-100 hover:bg-orange-50 cursor-pointer transition"
                >
                  <p className="font-semibold text-gray-800 text-sm">
                    {activeTab === "restaurants" ? "🍽️ " : "🍕 "}
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {activeTab === "restaurants"
                      ? item.cuisines.join(", ")
                      : item.category}
                  </p>
                </m.div>
              ))}
            </m.div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition"
        >
          Search
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => {
            setActiveTab("restaurants");
            setResults(null);
            setSuggestions([]);
            setShowSuggestions(false);
          }}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === "restaurants"
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Restaurants
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("items");
            setResults(null);
            setSuggestions([]);
            setShowSuggestions(false);
          }}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === "items"
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Dishes
        </button>
      </div>

      {/* Veg Filter - Only show for restaurants tab */}
      {activeTab === "restaurants" && (
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setVegFilter("all")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              vegFilter === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🍽️ All
          </button>
          <button
            type="button"
            onClick={() => setVegFilter("veg")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              vegFilter === "veg"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🥬 Veg Only
          </button>
          <button
            type="button"
            onClick={() => setVegFilter("nonveg")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              vegFilter === "nonveg"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🍗 Non-Veg
          </button>
        </div>
      )}

      {results && (
        <m.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-2 border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto"
        >
          {results.data.length > 0 ? (
            <div>
              <p className="font-semibold mb-3">
                Found {results.data.length} {results.type}
              </p>
              {results.data.map((item, index) => (
                <m.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => {
                    if (results.type === "restaurants") {
                      navigate(`/restaurant/${item.id}`);
                    }
                    onSearch?.(item, results.type);
                  }}
                >
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {results.type === "restaurants"
                      ? item.cuisines.join(", ")
                      : item.desc}
                  </p>
                </m.div>
              ))}
            </div>
          ) : (
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600 text-center py-4"
            >
              No results found
            </m.p>
          )}
        </m.div>
      )}
    </div>
  );
}


