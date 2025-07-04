import React, { useEffect, useState } from "react";
import {
  LocalShipping,
  Diamond,
  Close,
  CalendarToday,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import {
  notDeliveredOrdersAPI,
  fetchNotDeliveredOrderModalItems,
} from "../../../api/customerAPIs";

const NotDeliveredOrders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalItems, setModalItems] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const token = useSelector((state) => state.auth.user?.token);

  const fetchNotDeliveredOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await notDeliveredOrdersAPI(token);
      console.log(res);
      if (res.status === 201) {
        setOrders(res.data.notDeliveredOrders || []);
      } else {
        setError(res.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
      setError("Failed to fetch orders. Please try again later.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (itemsIds) => {
    try {
      setModalLoading(true);
      const res = await fetchNotDeliveredOrderModalItems({ itemsIds }, token);
      if (res.status === 200) {
        setModalItems(res.data.notDeliveredOrderModalItems);
      }
    } catch (error) {
      console.error("Failed to fetch order items", error);
      setModalItems([]);
    } finally {
      setModalLoading(false);
    }
  };

  const openOrderModal = async (order) => {
    setSelectedOrder(order);
    if (order.items && order.items.length > 0) {
      await fetchOrderItems(order.items);
    }
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setModalItems([]);
  };

  useEffect(() => {
    if (token) {
      fetchNotDeliveredOrders();
    }
  }, [token]);

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.deliveryStatus === activeTab);

  const getStatusColor = (status) => {
    switch (status) {
      case "not_delivered":
        return "bg-amber-100 text-amber-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="text-center">
          <Diamond
            className="animate-pulse text-amber-500 mx-auto"
            style={{ fontSize: "4rem" }}
          />
          <p className="text-amber-800 mt-4">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="text-center max-w-md">
          <Diamond
            className="text-amber-500 mx-auto"
            style={{ fontSize: "4rem" }}
          />
          <h3 className="text-xl font-medium text-amber-900 mt-4">
            Error loading orders
          </h3>
          <p className="text-amber-600 mt-2">{error}</p>
          <button
            onClick={fetchNotDeliveredOrders}
            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="text-center mb-8 md:mb-12">
    <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">
      Your Orders
    </h1>
    <p className="text-amber-700 text-lg">
      Track your precious jewelry purchases
    </p>
  </div>

  <div className="flex flex-wrap justify-center gap-3 mb-8">
    {["all", "processing", "shipped", "not_delivered"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-5 py-2 rounded-full font-medium capitalize transition-all text-sm md:text-base ${
          activeTab === tab
            ? "bg-amber-600 text-white shadow-md"
            : "bg-white text-amber-800 hover:bg-amber-100 border border-amber-200"
        }`}
      >
        {tab.replace("_", " ")}
      </button>
    ))}
  </div>

  <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
    {filteredOrders.length === 0 ? (
      <div className="p-8 md:p-12 text-center">
        <Diamond
          className="text-amber-400 mx-auto"
          style={{ fontSize: "4rem" }}
        />
        <h3 className="text-xl md:text-2xl font-medium text-amber-900 mt-4">
          {activeTab === "all"
            ? "No orders found"
            : `No ${activeTab.replace("_", " ")} orders`}
        </h3>
        <p className="text-amber-600 mt-2 md:text-lg">
          {activeTab === "all"
            ? "Your purchased jewelry will appear here"
            : "Try checking all orders"}
        </p>
      </div>
    ) : (
      <div className="divide-y divide-amber-100">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="p-4 md:p-6 hover:bg-amber-50 transition-colors"
          >
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="w-full md:w-1/4 lg:w-1/5 aspect-square bg-amber-100 rounded-lg flex items-center justify-center relative">
                {order.items?.length > 0 && (
                  <span className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-black px-2 py-1 rounded text-xs md:text-sm font-medium shadow">
                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </span>
                )}
                <Diamond className="text-amber-400 text-4xl" />
              </div>

              <div className="flex-1 space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-amber-900">
                      Order #{order._id?.slice(-6).toUpperCase() || "N/A"}
                    </h3>
                    <p className="text-sm text-amber-600">
                      Placed on {formatDate(order.orderDate)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.deliveryStatus
                    )}`}
                  >
                    {order.deliveryStatus?.replace("_", " ") || "unknown"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarToday
                      className="text-amber-500"
                      fontSize="small"
                    />
                    <div>
                      <p className="text-xs text-amber-600">
                        Expected Delivery
                      </p>
                      <p className="font-medium text-sm md:text-base">
                        {formatDate(order.expectedDeliveryDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <LocalShipping
                      className="text-amber-500"
                      fontSize="small"
                    />
                    <div>
                      <p className="text-xs text-amber-600">Shipping</p>
                      <p className="font-medium text-sm md:text-base">
                        {order.deliveryStatus === "shipped"
                          ? "On the way"
                          : "Preparing"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <p className="text-lg md:text-xl font-bold text-amber-800">
                    ₹{order.orderCost?.toLocaleString() || "0"}
                  </p>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => openOrderModal(order)}
                      className="px-4 py-2 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors text-sm md:text-base flex-1 sm:flex-none"
                    >
                      View Details
                    </button>
                    {order.deliveryStatus === "shipped" && (
                      <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm md:text-base flex-1 sm:flex-none">
                        Track Package
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>

  <div className="bg-white p-6 rounded-xl shadow-md">
    <h4 className="font-medium text-lg text-amber-900 mb-4">
      Order Status Guide
    </h4>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-amber-400"></span>
        <span className="text-sm md:text-base">Processing - Being crafted by artisans</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-blue-400"></span>
        <span className="text-sm md:text-base">Shipped - On its way to you</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-gray-400"></span>
        <span className="text-sm md:text-base">Delivered - Received successfully</span>
      </div>
    </div>
  </div>
</div>
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="border-b border-amber-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-amber-900">
                Order Details - #
                {selectedOrder._id?.slice(-6).toUpperCase() || "N/A"}
              </h2>
              <button
                onClick={closeOrderModal}
                className="text-amber-600 hover:text-amber-800 transition-colors"
              >
                <Close fontSize="large" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1 p-6">
              {modalLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Diamond
                    className="animate-pulse text-amber-500"
                    style={{ fontSize: "3rem" }}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Order Summary */}
                  <div className="lg:col-span-1 bg-amber-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-amber-900 mb-4">
                      Order Summary
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-amber-600">Order Status</p>
                        <p
                          className={`font-medium ${getStatusColor(
                            selectedOrder.deliveryStatus
                          )} inline-block px-2 py-1 rounded-full`}
                        >
                          {selectedOrder.deliveryStatus?.replace("_", " ") ||
                            "unknown"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-amber-600">Order Date</p>
                        <p className="font-medium">
                          {formatDate(selectedOrder.orderDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-amber-600">
                          Expected Delivery
                        </p>
                        <p className="font-medium">
                          {formatDate(selectedOrder.expectedDeliveryDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-amber-600">Payment Method</p>
                        <p className="font-medium">
                          {selectedOrder.paymentMethod || "Not specified"}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-amber-200">
                        <p className="text-sm text-amber-600">Total Amount</p>
                        <p className="text-2xl font-bold text-amber-800">
                          ₹{selectedOrder.orderCost?.toLocaleString() || "0"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-amber-900 mb-4">
                      Items ({modalItems.length})
                    </h3>

                    <div className="space-y-6">
                      {modalItems.length > 0 ? (
                        modalItems.map((item) => (
                          <div
                            key={item._id}
                            className="flex flex-col sm:flex-row gap-4 border-b border-amber-100 pb-6"
                          >
                            <div className="sm:w-1/4">
                              <div className="aspect-square bg-amber-100 rounded-lg overflow-hidden">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Diamond className="w-full h-full text-amber-300 p-4" />
                                )}
                              </div>
                            </div>

                            <div className="sm:w-3/4">
                              <h4 className="text-lg font-medium text-amber-900">
                                {item.name}
                              </h4>
                              <p className="text-amber-600 mb-2">
                                {item.category}
                              </p>

                              <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                  <p className="text-sm text-amber-600">
                                    Quantity
                                  </p>
                                  <p className="font-medium">
                                    {item.quantity || 1}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-amber-600">
                                    Price
                                  </p>
                                  <p className="font-medium">
                                    ₹{item.price?.toLocaleString() || "0"}
                                  </p>
                                </div>
                              </div>

                              {item.description && (
                                <div>
                                  <p className="text-sm text-amber-600">
                                    Description
                                  </p>
                                  <p className="text-amber-800">
                                    {item.description}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <Diamond
                            className="text-amber-300 mx-auto"
                            style={{ fontSize: "4rem" }}
                          />
                          <p className="text-amber-600 mt-4">
                            No items found for this order
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-amber-200 p-4 flex justify-end">
              <button
                onClick={closeOrderModal}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotDeliveredOrders;
