import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { m } from "framer-motion";
import { RESTAURANTS, MENU } from "../data";
import { setCurrentRestaurant, loadRestaurantItems, addItem, updateItem, deleteItem } from "../redux/restaurantSlice";

// Firebase imports
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function RestaurantAdminPanel() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector(state => state.user);
  const { currentRestaurant, items } = useSelector(state => state.restaurant);

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [itemsLoading, setItemsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    price: "",
    category: "Pizza",
    veg: true,
    badge: ""
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Load restaurant items from MENU data + Firestore custom items
  const loadItemsForRestaurant = async (restaurant) => {
    setItemsLoading(true);
    try {
      // Base menu items from local data
      const menuItems = MENU.filter(item => restaurant.menu.includes(item.id));

      // Custom items from Firestore
      const customItemsSnap = await getDocs(
        collection(db, "restaurants", String(restaurant.id), "customItems")
      );
      const customItems = customItemsSnap.docs.map(d => d.data());

      dispatch(loadRestaurantItems([...menuItems, ...customItems]));
    } catch (err) {
      console.error("Error loading restaurant items from Firestore:", err);
      // Fallback to menu items only
      const menuItems = MENU.filter(item => restaurant.menu.includes(item.id));
      dispatch(loadRestaurantItems(menuItems));
    } finally {
      setItemsLoading(false);
    }
  };

  // Initialize with first restaurant
  useEffect(() => {
    if (RESTAURANTS.length > 0 && !selectedRestaurant) {
      const firstRestaurant = RESTAURANTS[0];
      setSelectedRestaurant(firstRestaurant);
      dispatch(setCurrentRestaurant(firstRestaurant));
      loadItemsForRestaurant(firstRestaurant);
    }
  }, [dispatch]);

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    dispatch(setCurrentRestaurant(restaurant));
    loadItemsForRestaurant(restaurant);
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      alert("Please fill required fields");
      return;
    }

    if (editingItem) {
      // Update existing custom item
      const updatedItem = {
        ...editingItem,
        ...formData,
        updatedAt: new Date().toISOString()
      };
      dispatch(updateItem(updatedItem));

      // Sync to Firestore (only if it's a custom item, not from MENU)
      if (!selectedRestaurant.menu.includes(editingItem.id)) {
        try {
          await updateDoc(
            doc(db, "restaurants", String(selectedRestaurant.id), "customItems", String(editingItem.id)),
            updatedItem
          );
        } catch (err) {
          console.error("Failed to update item in Firestore:", err);
        }
      }
      setEditingItem(null);
    } else {
      // Add new custom item
      const newItem = {
        id: `custom-${Date.now()}`,
        ...formData,
        price: Number(formData.price),
        restaurantId: selectedRestaurant?.id,
        isCustom: true,
        createdAt: new Date().toISOString()
      };
      dispatch(addItem(newItem));

      // Persist to Firestore
      try {
        await setDoc(
          doc(db, "restaurants", String(selectedRestaurant.id), "customItems", String(newItem.id)),
          newItem
        );
      } catch (err) {
        console.error("Failed to save new item to Firestore:", err);
      }
    }

    // Reset form
    setFormData({
      name: "",
      desc: "",
      price: "",
      category: "Pizza",
      veg: true,
      badge: ""
    });
    setShowAddForm(false);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      desc: item.desc,
      price: item.price,
      category: item.category,
      veg: item.veg,
      badge: item.badge || ""
    });
    setShowAddForm(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      dispatch(deleteItem(itemId));

      // Delete from Firestore if it's a custom item
      if (!selectedRestaurant.menu.includes(itemId)) {
        try {
          await deleteDoc(
            doc(db, "restaurants", String(selectedRestaurant.id), "customItems", String(itemId))
          );
        } catch (err) {
          console.error("Failed to delete item from Firestore:", err);
        }
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({
      name: "",
      desc: "",
      price: "",
      category: "Pizza",
      veg: true,
      badge: ""
    });
  };

  // Check if item is from original menu or custom
  const isMenuItemFromData = (item) => {
    return selectedRestaurant && selectedRestaurant.menu.includes(item.id);
  };

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(items.map(item => item.category))];

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🍽️ Restaurant Admin Panel</h1>
          <p className="text-gray-600">Manage your restaurant menu items</p>
        </m.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Restaurant Selection */}
          <div className="bg-white rounded-lg shadow-md p-4 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Restaurants</h2>
            <div className="space-y-2">
              {RESTAURANTS.map(restaurant => (
                <button
                  type="button"
                  key={restaurant.id}
                  onClick={() => handleSelectRestaurant(restaurant)}
                  className={`w-full text-left p-3 rounded-lg transition font-medium ${
                    selectedRestaurant?.id === restaurant.id
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {restaurant.name}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedRestaurant ? (
              <>
                {/* Restaurant Info Card */}
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-lg shadow-md p-6 mb-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {selectedRestaurant.name}
                      </h2>
                      <p className="text-gray-600 mb-2">📍 {selectedRestaurant.location}</p>
                      <p className="text-gray-600">🍽️ {selectedRestaurant.cuisines.join(", ")}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-orange-500">⭐ {selectedRestaurant.rating}</div>
                      <p className="text-gray-600">Menu Items: {items.length}</p>
                    </div>
                  </div>
                </m.div>

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
                    >
                      {showAddForm ? "Cancel" : "+ Add Item"}
                    </button>
                  </div>
                </div>

                {/* Add/Edit Form */}
                {showAddForm && (
                  <m.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-orange-500"
                  >
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      {editingItem ? "Edit Item" : "Add New Item"}
                    </h3>
                    <form onSubmit={handleAddItem} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Item Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            placeholder="e.g., Margherita Pizza"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                          >
                            <option value="Pizza">Pizza</option>
                            <option value="Burger">Burger</option>
                            <option value="Drink">Drink</option>
                            <option value="Appetizer">Appetizer</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Salad">Salad</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price (₹) *
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleFormChange}
                            placeholder="e.g., 299"
                            step="10"
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Badge (e.g., Bestseller, Hot Pick)
                          </label>
                          <input
                            type="text"
                            name="badge"
                            value={formData.badge}
                            onChange={handleFormChange}
                            placeholder="e.g., Bestseller"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          name="desc"
                          value={formData.desc}
                          onChange={handleFormChange}
                          placeholder="Describe your item..."
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="veg"
                            checked={formData.veg}
                            onChange={handleFormChange}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-gray-700 font-medium">Vegetarian</span>
                        </label>
                      </div>
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
                        >
                          {editingItem ? "Update Item" : "Add Item"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </m.div>
                )}

                {/* Items List */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Menu Items ({filteredItems.length})
                    </h3>
                  </div>
                  {itemsLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-orange-500"></div>
                    </div>
                  ) : filteredItems.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Source</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Badge</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredItems.map((item, index) => (
                            <m.tr
                              key={item.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="border-b border-gray-200 hover:bg-gray-50 transition"
                            >
                              <td className="px-6 py-4 text-gray-800 font-medium">{item.name}</td>
                              <td className="px-6 py-4 text-gray-700">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                  {item.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-800 font-semibold">₹{item.price}</td>
                              <td className="px-6 py-4 text-gray-700">
                                {item.veg ? "🥬 Veg" : "🍗 Non-Veg"}
                              </td>
                              <td className="px-6 py-4 text-gray-700">
                                {isMenuItemFromData(item) ? (
                                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                    📋 Menu
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                                    ✨ Custom
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-gray-700">
                                {item.badge ? (
                                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                                    {item.badge}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-6 py-4 flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEditItem(item)}
                                  className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
                                >
                                  🗑️ Delete
                                </button>
                              </td>
                            </m.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <p className="text-lg">No items found. Add your first item to get started! 🍴</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 text-lg">Select a restaurant to manage items</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
