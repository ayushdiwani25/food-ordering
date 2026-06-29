import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { m } from "framer-motion";
import { expireActiveOrders, cancelOrder, loadOrders } from "../redux/orderSlice";

// Firebase imports
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export default function OrdersPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders } = useSelector(state => state.orders);
  const { isLoggedIn, user } = useSelector(state => state.user);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      dispatch(cancelOrder(orderId));
      // Sync cancellation to Firestore
      try {
        await updateDoc(doc(db, "orders", orderId), { status: "Cancelled" });
      } catch (err) {
        console.error("Failed to sync cancellation to Firestore:", err);
      }
      alert("Order cancelled successfully!");
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800 mb-4">
            Please login to view your orders
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter(
    o => (o.status === "Confirmed" || o.status === "Out for Delivery") && o.isActive
  );
  const completedOrders = orders.filter(o => o.status === "Delivered");
  const cancelledOrders = orders.filter(o => o.status === "Cancelled");

  const getTimeRemaining = (expireTime) => {
    if (!expireTime) return null;
    const now = Date.now();
    const remaining = expireTime - now;
    if (remaining <= 0) return null;
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return { minutes, seconds };
  };

  const displayOrders =
    activeTab === "active"
      ? activeOrders
      : activeTab === "completed"
        ? completedOrders
        : cancelledOrders;

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-100 text-blue-800";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return "✓";
      case "Out for Delivery":
        return "🚴";
      case "Delivered":
        return "✓✓";
      case "Cancelled":
        return "✗";
      default:
        return "•";
    }
  };

  // Fetch orders from Firestore on mount and expire stale ones
  useEffect(() => {
    dispatch(expireActiveOrders());

    if (!isLoggedIn || !user?.uid) return;

    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const firestoreOrders = snapshot.docs.map(d => d.data());
        // Sort by placedAt descending
        firestoreOrders.sort((a, b) => (b.placedAt || 0) - (a.placedAt || 0));
        dispatch(loadOrders(firestoreOrders));
      } catch (err) {
        console.error("Failed to load orders from Firestore:", err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [dispatch, isLoggedIn, user?.uid]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your all orders</p>
        </m.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b-2 border-gray-300">
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`px-6 py-4 font-semibold transition border-b-4 ${
              activeTab === "active"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-600 hover:text-orange-500"
            }`}
          >
            Active ({activeOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`px-6 py-4 font-semibold transition border-b-4 ${
              activeTab === "completed"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-600 hover:text-orange-500"
            }`}
          >
            Completed ({completedOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cancelled")}
            className={`px-6 py-4 font-semibold transition border-b-4 ${
              activeTab === "cancelled"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-600 hover:text-orange-500"
            }`}
          >
            Cancelled ({cancelledOrders.length})
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {ordersLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-orange-500"></div>
            </div>
          ) : displayOrders.length > 0 ? (
            displayOrders.map((order, index) => {
              const timeRemaining = getTimeRemaining(order.activeExpireTime);
              return (
              <m.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Order ID</p>
                    <p className="font-bold text-lg text-gray-800">{order.id}</p>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Restaurant</p>
                    <p className="font-semibold text-gray-800">
                      {order.restaurant}
                    </p>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Amount</p>
                    <p className="font-bold text-xl text-orange-500">
                      ₹{order.total}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Items</p>
                    <p className="font-semibold text-gray-800">
                      {order.items.length} items
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 mb-1">🚚 Delivery</p>
                    <p className="font-semibold text-gray-800">
                      {order.estimatedDelivery}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 mb-1">📍 Location</p>
                    <p className="font-semibold text-gray-800 truncate">
                      {order.address}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 mb-1">📅 Date</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => handleViewDetails(order)}
                    className="flex-1 px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 font-semibold"
                  >
                    View Details
                  </button>
                  {order.status === "Delivered" && !order.review && (
                    <button type="button" className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 font-semibold">
                      Write Review
                    </button>
                  )}
                  {order.status === "Confirmed" && (
                    <button 
                      type="button"
                      onClick={() => handleCancelOrder(order.id)}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-semibold"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </m.div>
            );
            })
          ) : (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-lg border border-gray-200"
            >
              <p className="text-2xl text-gray-600 mb-4">
                {activeTab === "active"
                  ? "No active orders"
                  : activeTab === "completed"
                    ? "No completed orders"
                    : "No cancelled orders"}
              </p>
              <button
                type="button"
                onClick={() => navigate("/restaurants")}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold"
              >
                Start Ordering
              </button>
            </m.div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <m.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                    <p className="text-gray-600 mt-1">Order ID: {selectedOrder.id}</p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span className={`px-3 py-1 rounded-full font-semibold text-sm ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-orange-500">₹{selectedOrder.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Restaurant</p>
                    <p className="font-semibold text-gray-800">{selectedOrder.restaurant}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                    <p className="font-semibold text-gray-800 capitalize">{selectedOrder.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Delivery Time</p>
                    <p className="font-semibold text-gray-800">{selectedOrder.estimatedDelivery}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order Date</p>
                    <p className="font-semibold text-gray-800">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                        </div>
                        <p className="font-bold text-gray-800">₹{item.price * item.qty}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Delivery Address</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedOrder.address}</p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold"
                >
                  Close
                </button>
              </div>
            </m.div>
          </div>
        )}
      </div>
    </div>
  );
}
