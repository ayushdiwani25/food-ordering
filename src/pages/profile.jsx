import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, updateProfile } from "../redux/userSlice";
import AddressManagement from "../components/address-management";
import { motion } from "framer-motion";

// ===== HELPER: Tab Button =====
function TabButton({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-4 font-semibold border-b-4 transition ${
        active
          ? "border-orange-500 text-orange-600"
          : "border-transparent text-gray-600 hover:text-orange-500"
      }`}
    >
      {label}
    </button>
  );
}

// ===== HELPER: Profile Info Card =====
function InfoCard({ icon, label, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg p-5 shadow-md border-2 border-gray-200"
    >
      <p className="text-gray-600 text-sm font-semibold mb-2">{icon} {label}</p>
      <p className="text-xl font-bold text-gray-800">{value || "Not added"}</p>
    </motion.div>
  );
}

// ===== HELPER: Settings Checkbox =====
function SettingCheckbox({ icon, label, defaultChecked = true }) {
  return (
    <label className="flex items-center p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 border-2 border-blue-200 transition">
      <input type="checkbox" defaultChecked={defaultChecked} className="w-5 h-5 text-orange-500 rounded" />
      <span className="ml-3 font-semibold text-gray-800">{icon} {label}</span>
    </label>
  );
}

// ===== MAIN COMPONENT =====
export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector(state => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user || {});
  const [activeTab, setActiveTab] = useState("profile");

  // If not logged in, show login prompt
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white p-8 rounded-2xl shadow-lg border-2 border-orange-200"
        >
          <p className="text-6xl mb-4">🔐</p>
          <p className="text-2xl font-bold text-gray-800 mb-4">Please login to view your profile</p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 font-semibold"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  const handleSave = () => {
    dispatch(updateProfile(editData));
    setIsEditing(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b-2 border-gray-300">
          <TabButton active={activeTab === "profile"} label="Profile" onClick={() => setActiveTab("profile")} />
          <TabButton active={activeTab === "addresses"} label="Addresses" onClick={() => setActiveTab("addresses")} />
          <TabButton active={activeTab === "settings"} label="Settings" onClick={() => setActiveTab("settings")} />
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-linear-to-r from-orange-50 to-red-50 rounded-2xl p-8 shadow-lg border-2 border-orange-200"
          >
            {!isEditing ? (
              <div>
                {/* User Header */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b-2 border-orange-300">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-24 h-24 bg-linear-to-r from-orange-400 to-red-400 text-white rounded-full flex items-center justify-center text-5xl font-bold shadow-lg"
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </motion.div>
                  <div className="flex-1">
                    <h2 className="text-4xl font-bold text-gray-800">{user?.name}</h2>
                    <p className="text-lg text-orange-600 font-semibold mt-2">📧 {user?.email}</p>
                    <p className="text-sm text-gray-600">👤 {user?.isAdmin ? "👑 Admin Account" : "👤 Regular User"}</p>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <InfoCard icon="📱" label="Phone" value={user?.phone} />
                  <InfoCard icon="📅" label="Member Since" value={user?.memberSince} />
                  <InfoCard icon="🔐" label="Account Type" value={user?.isAdmin ? "👑 Admin" : "👤 User"} />
                </div>

                <button
                  onClick={() => {
                    setEditData(user);
                    setIsEditing(true);
                  }}
                  className="px-8 py-3 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 font-semibold"
                >
                  ✏️ Edit Profile
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">✏️ Edit Profile</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editData.name || ""}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email (Read-only)</label>
                    <input
                      type="email"
                      value={editData.email || ""}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editData.phone || ""}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-bold"
                  >
                    💾 Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-bold"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ADDRESSES TAB */}
        {activeTab === "addresses" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AddressManagement />
          </motion.div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-8 shadow-md border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-8">⚙️ Settings</h3>

            {/* Notifications */}
            <div className="mb-10">
              <h4 className="text-lg font-bold text-gray-800 mb-4">🔔 Notifications</h4>
              <div className="space-y-3">
                <SettingCheckbox icon="📱" label="Order updates via SMS" />
                <SettingCheckbox icon="🎉" label="Promotional offers & deals" />
                <SettingCheckbox icon="💌" label="Newsletter & updates" />
              </div>
            </div>

            {/* Account Info */}
            <div className="mb-10 bg-gray-50 p-6 rounded-lg border-2 border-gray-300">
              <h4 className="text-lg font-bold text-gray-800 mb-4">ℹ️ Account Information</h4>
              <p className="text-gray-700"><strong>Email:</strong> {user?.email}</p>
              <p className="text-gray-700"><strong>Account Type:</strong> {user?.isAdmin ? "👑 Admin" : "👤 User"}</p>
              <p className="text-gray-700"><strong>Member Since:</strong> {user?.memberSince}</p>
            </div>

            {/* Security */}
            <div className="mb-10 bg-yellow-50 p-6 rounded-lg border-2 border-yellow-300">
              <h4 className="text-lg font-bold text-yellow-800 mb-4">🔐 Security</h4>
              <p className="text-yellow-700 mb-4">Your data is stored securely in localStorage.</p>
              <button className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold">
                🔄 Change Password
              </button>
            </div>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full px-8 py-4 bg-linear-to-r from-yellow-500 to-orange-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-bold text-lg shadow-lg"
            >
              🚪 Logout
            </motion.button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
