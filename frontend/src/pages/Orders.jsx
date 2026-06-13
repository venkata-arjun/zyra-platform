import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import toast from "react-hot-toast";

const statusStyles = {
  "Order Placed": "bg-gray-100 text-gray-600",
  Packing: "bg-amber-50 text-amber-700",
  Shipped: "bg-blue-50 text-blue-700",
  "Out for delivery": "bg-purple-50 text-purple-700",
  Delivered: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
};

const getStatusStyle = (status) =>
  statusStyles[status] || "bg-gray-100 text-gray-600";

const FILTERS = [
  "All",
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered",
  "Cancelled",
];

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadOrderData = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } },
      );

      if (response.data.success) {
        setOrders(response.data.orders.slice().reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    const matchesSearch =
      search.trim() === "" ||
      order.items.some((it) =>
        it.name.toLowerCase().includes(search.trim().toLowerCase()),
      );

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="border-t border-gray-200 pt-10 sm:pt-16 px-4 sm:px-0 pb-16">
      {/* Header */}
      <div className="text-2xl mb-6">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {/* Search */}
      {!loading && orders.length > 0 && (
        <div className="mb-5 flex flex-col gap-3">
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your orders"
              className="w-full sm:max-w-sm rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
            />
          </div>

          {/* Status filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                  statusFilter === f
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 animate-pulse"
            >
              <div className="w-16 h-16 flex-shrink-0 rounded-xl bg-gray-100" />
              <div className="flex-1 space-y-2.5">
                <div className="h-4 w-2/3 bg-gray-100 rounded" />
                <div className="h-3 w-1/3 bg-gray-100 rounded" />
                <div className="h-3 w-1/4 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20 gap-2">
          <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-2">
            <svg
              className="w-6 h-6 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p className="text-base font-semibold text-gray-800">No orders yet</p>
          <p className="text-sm text-gray-400 max-w-xs">
            When you place an order, it'll show up here so you can track it.
          </p>
        </div>
      )}

      {/* No results for filter/search */}
      {!loading && orders.length > 0 && filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-16 gap-2">
          <p className="text-sm text-gray-400">
            No orders match your search or filter.
          </p>
        </div>
      )}

      {/* Order Cards */}
      {!loading && filteredOrders.length > 0 && (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const firstItem = order.items[0];
            const extraCount = order.items.length - 1;
            const totalQty = order.items.reduce(
              (sum, it) => sum + Number(it.quantity || 0),
              0,
            );

            return (
              <button
                key={order._id}
                onClick={() =>
                  navigate(`/orders/${order._id}`, { state: { order } })
                }
                className="w-full text-left flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm active:scale-[0.99] transition-all duration-200"
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                  <img
                    className="w-full h-full object-cover object-top"
                    src={firstItem.image[0]}
                    alt={firstItem.name}
                  />
                  {extraCount > 0 && (
                    <span className="absolute bottom-0 right-0 left-0 bg-black/60 text-white text-[10px] font-semibold text-center py-0.5">
                      +{extraCount} more
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                    {firstItem.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {currency}
                    {order.amount} · {totalQty} item{totalQty > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Placed on {new Date(order.date).toDateString()}
                  </p>
                </div>

                {/* Status + chevron */}
                <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${getStatusStyle(
                      order.status,
                    )}`}
                  >
                    <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-50"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
                    </span>
                    {order.status}
                  </span>

                  <svg
                    className="w-4 h-4 text-gray-300 group-hover:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
