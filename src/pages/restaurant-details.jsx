import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { RESTAURANTS, MENU } from "../data";
import { addFavoriteRestaurant } from "../redux/favoritesSlice";
import { addToCart } from "../redux/cartSlice";

export default function RestaurantDetailsPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart || []);
  const restaurant = RESTAURANTS.find(r => r.id === parseInt(restaurantId));
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addedItems, setAddedItems] = useState({});

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Restaurant not found</p>
      </div>
    );
  }

  const restaurantMenu = MENU.filter(item => restaurant.menu.includes(item.id));
  const uniqueCategories = ["All", ...new Set(restaurantMenu.map(item => item.category))];
  const filteredMenu =
    selectedCategory === "All"
      ? restaurantMenu
      : restaurantMenu.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item) => {
    const existingItem = cartItems.find((i) => i.id === item.id);
    
    // Only allow adding once per click session, prevent spamming
    if (!addedItems[item.id]) {
      if (existingItem) {
        dispatch(addToCart({ ...item, qty: existingItem.qty + 1 }));
      } else {
        dispatch(addToCart({ ...item, qty: 1 }));
      }

      // Show animation feedback & lock button temporarily
      setAddedItems({ ...addedItems, [item.id]: true });
      setTimeout(() => {
        setAddedItems({ ...addedItems, [item.id]: false });
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-96 overflow-hidden bg-gray-200">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/restaurants")}
          className="absolute top-4 left-4 bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
        >
          ← Back
        </button>
      </div>

      {/* Restaurant Info */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 mb-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {restaurant.name}
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                {restaurant.cuisines.join(" • ")}
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="font-bold text-lg text-gray-800">
                      {restaurant.rating}
                    </p>
                    <p className="text-sm text-gray-600">Rating</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚚</span>
                  <div>
                    <p className="font-bold text-lg text-gray-800">
                      ₹{restaurant.deliveryFee}
                    </p>
                    <p className="text-sm text-gray-600">Delivery Fee</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⏱️</span>
                  <div>
                    <p className="font-bold text-lg text-gray-800">
                      {restaurant.deliveryTime}
                    </p>
                    <p className="text-sm text-gray-600">Delivery Time</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsFavorite(!isFavorite);
                dispatch(addFavoriteRestaurant(restaurant));
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                isFavorite
                  ? "bg-red-100 text-red-600 border-2 border-red-600"
                  : "bg-gray-100 text-gray-600 border-2 border-gray-300"
              }`}
            >
              {isFavorite ? "❤️ Saved" : "🤍 Save"}
            </button>
          </div>

          {restaurant.offers && (
            <div className="mt-6 bg-linear-to-r from-orange-100 to-red-100 border-2 border-orange-300 rounded-lg p-4">
              <p className="text-orange-800 font-semibold">{restaurant.offers}</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-3 pb-2">
            {uniqueCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-500"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              <div className="relative h-40 bg-gray-200 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-110 transition"
                />
                {item.badge && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {item.badge}
                  </div>
                )}
                {item.veg ? (
                  <div className="absolute top-3 left-3 w-6 h-6 border-2 border-green-600 rounded flex items-center justify-center bg-white">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                ) : (
                  <div className="absolute top-3 left-3 w-6 h-6 border-2 border-red-600 rounded flex items-center justify-center bg-white">
                    <div className="w-2 h-2 bg-red-600"></div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.desc}
                </p>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-orange-500">
                    ₹{item.price}
                  </span>
                  <span className="flex items-center text-yellow-500 font-semibold">
                    ⭐ {item.rating}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={addedItems[item.id]}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition ${
                    addedItems[item.id]
                      ? "bg-gray-400 cursor-not-allowed text-gray-200"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  {addedItems[item.id] ? "Added!" : "Add to Cart"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
