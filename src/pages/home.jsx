import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/background.jpg";
import pizzaImg from "../assets/Margherita-Royale.png";
import burgerImg from "../assets/Classic-Smash-Burger.png";
import drinkImg from "../assets/Mango-Chiller.png";

export default function Home() {
  const navigate = useNavigate();
  const [hoveredGallery, setHoveredGallery] = useState(null);

  const galleryItems = [
    { id: 1, label: "Pizza", category: "Pizza", img: pizzaImg },
    { id: 2, label: "Burger", category: "Burger", img: burgerImg },
    { id: 3, label: "Cold Drink", category: "Drinks", img: drinkImg },
  ];

  return (
    <div 
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.2) 0%, transparent 100%), url(${backgroundImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white/95 pointer-events-none"></div>
      
      {/* Hero Section */}
      <motion.div 
        className="relative z-10 flex-1 flex flex-col justify-center px-6 lg:px-20 py-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl">
          {/* Hero Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black text-white drop-shadow-lg leading-[1.1] mb-8"
          >
            Welcome to <br /> 
            <span className="flex items-center gap-4">
              FoodRush <span className="text-5xl md:text-7xl">🍽️</span>
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-white/95 drop-shadow-md font-medium max-w-2xl mb-10 leading-relaxed"
          >
            We deliver happiness to your doorstep. Fresh, delicious and made with love. Explore a variety of cuisines and satisfy your cravings anytime, anywhere.
          </motion.p>

          {/* Action Button */}
          <motion.button
            onClick={() => navigate("/food")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.08, backgroundColor: "#ea580c" }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 bg-orange-600 text-white font-black text-xl rounded-2xl shadow-2xl transition-all duration-300 uppercase tracking-wider hover:shadow-2xl inline-flex items-center gap-3"
          >
            Explore Food
            <motion.span
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>

          {/* Stats - Below button */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex gap-6 pt-12 flex-wrap"
          >
            <motion.div 
              className="flex flex-col bg-white/15 backdrop-blur-md rounded-xl p-6 border-l-4 border-orange-400 hover:bg-white/25 transition-all"
              whileHover={{ scale: 1.08 }}
            >
              <span className="text-4xl font-black text-orange-300">1000+</span>
              <span className="text-sm text-white/80 font-semibold">Dishes</span>
            </motion.div>
            <motion.div 
              className="flex flex-col bg-white/15 backdrop-blur-md rounded-xl p-6 border-l-4 border-red-400 hover:bg-white/25 transition-all"
              whileHover={{ scale: 1.08 }}
            >
              <span className="text-4xl font-black text-orange-300">50+</span>
              <span className="text-sm text-white/80 font-semibold">Restaurants</span>
            </motion.div>
            <motion.div 
              className="flex flex-col bg-white/15 backdrop-blur-md rounded-xl p-6 border-l-4 border-yellow-400 hover:bg-white/25 transition-all"
              whileHover={{ scale: 1.08 }}
            >
              <span className="text-4xl font-black text-orange-300">⭐ 4.8</span>
              <span className="text-sm text-white/80 font-semibold">Rating</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Aesthetic Bottom Fade */}
      <div className="absolute bottom-0 w-full h-40 bg-linear-to-t from-white/95 to-transparent pointer-events-none"></div>

      {/* About Section */}
      <motion.div 
        className="px-6 lg:px-16 py-16 bg-linear-to-br from-white/95 to-orange-50/95 rounded-t-3xl lg:rounded-t-full mt-12 shadow-2xl backdrop-blur-sm relative z-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-linear-to-br from-orange-400 to-red-500 rounded-full shadow-xl flex items-center justify-center text-4xl">
          🍴
        </div>
        
        <h2 className="text-5xl font-black text-center mb-8 bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          About Us
        </h2>
        <p className="text-gray-700 text-center max-w-3xl mx-auto text-lg leading-relaxed font-medium">
          At <span className="font-black text-orange-600">FoodRush</span>, we believe food is not just about eating, it's about
          creating unforgettable experiences. Our mission is to connect you with the best cuisines and deliver your favorite meals quickly and safely. Whether you love pizza, burgers, or refreshing drinks, we've got something special for you.
        </p>
      </motion.div>

      {/* Image Gallery */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 max-w-6xl mx-auto relative z-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
         {galleryItems.map((item) => (
           <motion.div
             key={item.id}
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="relative overflow-hidden rounded-3xl shadow-xl group cursor-pointer h-80 border-4 border-white/20 hover:border-orange-400 transition-all duration-300"
             onMouseEnter={() => setHoveredGallery(item.id)}
             onMouseLeave={() => setHoveredGallery(null)}
             onClick={() => navigate('/food', { state: { category: item.category } })}
           >
            {/* Background overlay for mobile */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300 z-10"></div>
            
            <motion.img
              src={item.img}
              alt={item.label}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent flex items-end justify-center pb-6 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredGallery === item.id ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div className="text-center">
              
                <p className="text-white font-bold text-lg mt-2">{item.label}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="max-w-4xl mx-auto px-6 py-16 text-center relative z-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="backdrop-blur-sm bg-white/10 rounded-3xl p-8 border-2 border-white/20"
          whileHover={{ borderColor: "rgba(255, 165, 0, 0.5)" }}
        >
          <h3 className="text-4xl font-bold bg-linear-to-r from-orange-300 to-red-400 bg-clip-text text-transparent mb-6">
            Ready to Order?
          </h3>
          <p className="text-white/80 text-lg mb-8">
            Discover thousands of delicious meals ready to be delivered to your door!
          </p>
          <motion.button
            onClick={() => navigate("/food")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-linear-to-r from-orange-500 to-red-500 text-white font-bold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 text-lg border-2 border-yellow-300/50"
          >
            Browse Menu →
          </motion.button>
        </motion.div>
      </motion.div>

    
    </div>
  );
}
