import React, { useState } from "react";

export default function FilterComponent({ onFilterChange }) {
  const [filters, setFilters] = useState({
    veg: false,
    nonVeg: false,
    minRating: 0,
    priceRange: [0, 500],
    delivery: false
  });

  const handleVegChange = () => {
    const newFilters = { ...filters, veg: !filters.veg };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleNonVegChange = () => {
    const newFilters = { ...filters, nonVeg: !filters.nonVeg };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (e) => {
    const newFilters = { ...filters, minRating: parseFloat(e.target.value) };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (e) => {
    const newFilters = {
      ...filters,
      priceRange: [0, parseInt(e.target.value)]
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDeliveryChange = () => {
    const newFilters = { ...filters, delivery: !filters.delivery };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="w-full bg-white rounded-lg p-6 shadow-md border border-gray-200">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Filters</h3>

      {/* Diet */}
      <div className="mb-6">
        <h4 className="font-semibold text-lg mb-3 text-gray-700">Diet</h4>
        <label className="flex items-center mb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.veg}
            onChange={handleVegChange}
            className="w-4 h-4 mr-2 text-green-500 rounded"
          />
          <span className="text-gray-700">Vegetarian</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.nonVeg}
            onChange={handleNonVegChange}
            className="w-4 h-4 mr-2 text-red-500 rounded"
          />
          <span className="text-gray-700">Non-Vegetarian</span>
        </label>
      </div>

      {/* Ratings */}
      <div className="mb-6">
        <h4 className="font-semibold text-lg mb-3 text-gray-700">Rating</h4>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={filters.minRating}
          onChange={handleRatingChange}
          className="w-full accent-orange-500"
        />
        <p className="text-sm text-gray-600 mt-2">
          Minimum Rating: {filters.minRating.toFixed(1)} ⭐
        </p>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-semibold text-lg mb-3 text-gray-700">Price Range</h4>
        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={filters.priceRange[1]}
          onChange={handlePriceChange}
          className="w-full accent-orange-500"
        />
        <p className="text-sm text-gray-600 mt-2">
          Up to ₹{filters.priceRange[1]}
        </p>
      </div>

      {/* Delivery */}
      <div className="mb-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.delivery}
            onChange={handleDeliveryChange}
            className="w-4 h-4 mr-2 text-blue-500 rounded"
          />
          <span className="text-gray-700">Free Delivery</span>
        </label>
      </div>

      <button
        onClick={() => {
          setFilters({
            veg: false,
            nonVeg: false,
            minRating: 0,
            priceRange: [0, 500],
            delivery: false
          });
          onFilterChange({
            veg: false,
            nonVeg: false,
            minRating: 0,
            priceRange: [0, 500],
            delivery: false
          });
        }}
        className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
      >
        Clear All Filters
      </button>
    </div>
  );
}
