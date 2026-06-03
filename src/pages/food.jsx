import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { MENU, RESTAURANTS } from "../data";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Food() {
  const cartItems = useSelector((state) => state.cart || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [addedItems, setAddedItems] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

  // Debounce search input to avoid filtering on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const categories = ["All", ...new Set(MENU.map((item) => item.category))];

  const filteredMenu = MENU.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get restaurant for an item
  const getRestaurantForItem = (itemId) => {
    return RESTAURANTS.find(restaurant => restaurant.menu.includes(itemId));
  };

  const handleImageClick = (itemId) => {
    const restaurant = getRestaurantForItem(itemId);
    if (restaurant) {
      navigate(`/restaurant/${restaurant.id}`);
    }
  };

  const handleAddToCart = (item) => {
    const existingItem = cartItems.find((i) => i.id === item.id);
    const restaurant = getRestaurantForItem(item.id);

    // Only allow adding once per click session, prevent spamming
    if (!addedItems[item.id]) {
      if (existingItem) {
        dispatch(addToCart({ ...item, restaurantName: restaurant?.name, restaurantId: restaurant?.id, qty: existingItem.qty + 1 }));
      } else {
        dispatch(addToCart({ ...item, restaurantName: restaurant?.name, restaurantId: restaurant?.id, qty: 1 }));
      }

      // Show animation feedback & lock button temporarily
      setAddedItems(prev => ({ ...prev, [item.id]: true }));
      setTimeout(() => {
        setAddedItems(prev => ({ ...prev, [item.id]: false }));
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-yellow-50 to-red-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center px-6 py-12"
      >
        <h1 className="text-6xl font-black mb-4 bg-linear-to-r from-orange-600 via-red-500 to-red-600 bg-clip-text text-transparent">
          🍽️ Explore Our Delicious Menu
        </h1>
        <p className="text-lg text-gray-700 font-medium max-w-2xl mx-auto">
          Choose from our handpicked selection of mouth-watering dishes
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-2xl mx-auto px-6 mb-8"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 pl-12 bg-white border-2 border-orange-300 rounded-full shadow-lg focus:outline-none focus:border-orange-500 transition-all duration-300 text-gray-700 font-medium"
          />
          <motion.div
            className="absolute left-4 top-4 text-xl"
            animate={{ rotate: searchQuery ? 0 : [0, 360] }}
            transition={{ duration: 0.6 }}
          >
            🔍
          </motion.div>
          
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-4 text-xl hover:scale-125 transition-transform"
            >
              ✕
            </motion.button>
          )}
        </div>
        
        {searchQuery && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-orange-600 font-semibold mt-2 px-2"
          >
            Found {filteredMenu.length} result{filteredMenu.length !== 1 ? "s" : ""} for "{searchQuery}"
          </motion.p>
        )}
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-3 px-6 pb-12"
      >
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
              selectedCategory === category
                ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow-lg"
                : "bg-white text-orange-600 border-2 border-orange-300 hover:border-orange-500"
            }`}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* Menu Grid */}
      <motion.div
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMenu.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              {/* Card Container */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col hover:shadow-2xl transition-all duration-500">

                {/* Image Section */}
                <div className="relative bg-linear-to-br from-orange-100 to-yellow-100 overflow-hidden h-40 flex items-center justify-center cursor-pointer group" onClick={() => handleImageClick(item.id)}>
                  <motion.img
                    src={item.img}
                    alt={item.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 flex flex-col">
                  {/* Category Badge */}
                  <span className="text-xs text-orange-600 uppercase tracking-widest font-bold mb-1">
                    {item.category}
                  </span>

                  {/* Item Name */}
                  <h2 className="text-lg font-black text-gray-800 mb-1 line-clamp-2">
                    {item.name}
                  </h2>

                  {/* Veg/NonVeg */}
                  <span
                    className={`text-xs font-bold mb-2 ${
                      item.veg ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.veg ? "🌱 Veg" : "🍗 Non-Veg"}
                  </span>

                  {/* Description */}
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2 grow">
                    {item.desc}
                  </p>

                  {/* Rating & Time */}
                  <div className="flex justify-between items-center mb-3 py-2 border-t border-gray-200">
                    <motion.span
                      className="bg-linear-to-r from-yellow-300 to-yellow-100 text-yellow-800 px-2 py-0.5 rounded-lg text-xs font-bold"
                      whileHover={{ scale: 1.1 }}
                    >
                      ⭐ {item.rating}
                    </motion.span>
                    <span className="text-gray-600 text-xs font-medium">⏱ {item.time}</span>
                  </div>

                  {/* Price */}
                  <motion.div
                    className="mb-3"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <span className="text-2xl font-black text-transparent bg-linear-to-r from-orange-500 to-red-600 bg-clip-text">
                      ₹{item.price}
                    </span>
                  </motion.div>

                  {/* Add to Cart Button */}
                  <motion.button
                    onClick={() => handleAddToCart(item)}
                    whileHover={addedItems[item.id] ? {} : { scale: 1.05 }}
                    whileTap={addedItems[item.id] ? {} : { scale: 0.95 }}
                    disabled={addedItems[item.id]}
                    className={`w-full py-2 font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                      addedItems[item.id]
                        ? "bg-gray-400 cursor-not-allowed text-gray-200"
                        : "bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    }`}
                  >
                    <motion.span
                      animate={addedItems[item.id] ? { scale: [1, 1.2, 0.8] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      🛒
                    </motion.span>
                    <span>
                      {addedItems[item.id] ? "Added!" : "Add to Cart"}
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Empty State */}
      {filteredMenu.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-2xl text-gray-600 font-bold mb-4">
            {searchQuery ? `No items found for "${searchQuery}"` : "No items found in this category"}
          </p>
          <motion.button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            whileHover={{ scale: 1.05 }}
            className="px-6 py-2 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600"
          >
            Clear Filters
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}