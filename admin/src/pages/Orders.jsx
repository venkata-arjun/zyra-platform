import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import {
  Search,
  X,
  Package,
  MapPin,
  SlidersHorizontal,
  RotateCcw,
  Loader2,
} from "lucide-react";

const STATUS_CONFIG = {
  "Order Placed": {
    pill: "bg-gray-100 text-gray-600 border border-gray-200",
    dot: "bg-gray-400",
    bar: "w-1/5",
    barColor: "bg-gray-400",
  },
  Packing: {
    pill: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
    bar: "w-2/5",
    barColor: "bg-amber-400",
  },
  Shipped: {
    pill: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
    bar: "w-3/5",
    barColor: "bg-blue-500",
  },
  "Out for delivery": {
    pill: "bg-purple-50 text-purple-700 border border-purple-200",
    dot: "bg-purple-500",
    bar: "w-4/5",
    barColor: "bg-purple-500",
  },
  Delivered: {
    pill: "bg-green-50 text-green-700 border border-green-200",
    dot: "bg-green-500",
    bar: "w-full",
    barColor: "bg-green-500",
  },
  Cancelled: {
    pill: "bg-red-50 text-red-600 border border-red-200",
    dot: "bg-red-400",
    bar: "w-full",
    barColor: "bg-red-300",
  },
};

const STATUS_FILTERS = [
  { key: "all", label: "All Orders" },
  { key: "Order Placed", label: "Placed" },
  { key: "Packing", label: "Packed" },
  { key: "Shipped", label: "Shipped" },
  { key: "Out for delivery", label: "Out for Delivery" },
  { key: "Delivered", label: "Delivered" },
  { key: "Cancelled", label: "Cancelled" },
  { key: "refund-pending", label: "Refund Pending" },
  { key: "Refunded", label: "Refunded" },
];

const DATE_FILTERS = [
  { key: "all", label: "All Time" },
  { key: "today", label: "Today" },
  { key: "7days", label: "Last 7 Days" },
  { key: "30days", label: "Last 30 Days" },
  { key: "month", label: "This Month" },
  { key: "custom", label: "Custom Range" },
];

const matchesSearch = (order, query) => {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  const nameMatch =
    `${order.address?.firstName ?? ""} ${order.address?.lastName ?? ""}`
      .toLowerCase()
      .includes(q);
  const idMatch = order._id?.toLowerCase().includes(q);
  const productMatch = order.items?.some((item) =>
    item.name?.toLowerCase().includes(q),
  );
  return nameMatch || idMatch || productMatch;
};

const matchesStatusFilter = (order, filterKey) => {
  switch (filterKey) {
    case "all":
      return true;
    case "refund-pending":
      return (
        order.status === "Cancelled" &&
        order.payment &&
        order.refundStatus !== "Refunded"
      );
    case "Refunded":
      return order.refundStatus === "Refunded";
    default:
      return order.status === filterKey;
  }
};

const matchesDateFilter = (order, filterKey, customRange) => {
  if (filterKey === "all") return true;
  if (!order.date) return false;

  const orderDate = new Date(order.date);
  const now = new Date();

  switch (filterKey) {
    case "today":
      return orderDate.toDateString() === now.toDateString();
    case "7days": {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 7);
      return orderDate >= cutoff;
    }
    case "30days": {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 30);
      return orderDate >= cutoff;
    }
    case "month":
      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    case "custom": {
      if (!customRange.start && !customRange.end) return true;
      const start = customRange.start ? new Date(customRange.start) : null;
      const end = customRange.end ? new Date(customRange.end) : null;
      if (end) end.setHours(23, 59, 59, 999);
      if (start && orderDate < start) return false;
      if (end && orderDate > end) return false;
      return true;
    }
    default:
      return true;
  }
};

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [refundLoading, setRefundLoading] = useState(new Set());

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchAllOrders = async () => {
    if (!token) return null;
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRefund = async (orderId) => {
    try {
      setRefundLoading((prev) => new Set(prev).add(orderId));
      const response = await axios.post(
        backendUrl + "/api/order/refund",
        { orderId },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success("Refund processed successfully");
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || "Refund failed");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setRefundLoading((prev) => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const searchAndDateFiltered = useMemo(() => {
    return orders.filter(
      (order) =>
        matchesSearch(order, searchQuery) &&
        matchesDateFilter(order, dateFilter, customRange),
    );
  }, [orders, searchQuery, dateFilter, customRange]);

  const statusCounts = useMemo(() => {
    const counts = {};
    STATUS_FILTERS.forEach((f) => {
      counts[f.key] =
        f.key === "all"
          ? searchAndDateFiltered.length
          : searchAndDateFiltered.filter((o) => matchesStatusFilter(o, f.key))
              .length;
    });
    return counts;
  }, [searchAndDateFiltered]);

  const filteredOrders = useMemo(() => {
    return searchAndDateFiltered.filter((order) =>
      matchesStatusFilter(order, statusFilter),
    );
  }, [searchAndDateFiltered, statusFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== "" || statusFilter !== "all" || dateFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter("all");
    setCustomRange({ start: "", end: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* ── Page Header ── */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm">
            <img
              src={assets.parcel_icon}
              alt=""
              className="w-5 h-5 opacity-60"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 leading-tight">
              Orders
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {orders.length} total orders
            </p>
          </div>
        </div>

        {/* ── Search & Filter Panel (normal page flow, no sticky) ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
          <div className="px-4 sm:px-5 pt-4 pb-4 space-y-3">
            {/* Search + Date row */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by customer, order ID, or product…"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-9 py-2.5 text-sm text-slate-700 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Desktop date filter */}
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition hover:border-gray-300 focus:border-slate-300 cursor-pointer"
                >
                  {DATE_FILTERS.map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label}
                    </option>
                  ))}
                </select>

                {dateFilter === "custom" && (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="date"
                      value={customRange.start}
                      onChange={(e) =>
                        setCustomRange((r) => ({ ...r, start: e.target.value }))
                      }
                      className="rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-slate-300"
                    />
                    <span className="text-gray-300 text-xs">to</span>
                    <input
                      type="date"
                      value={customRange.end}
                      onChange={(e) =>
                        setCustomRange((r) => ({ ...r, end: e.target.value }))
                      }
                      className="rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-slate-300"
                    />
                  </div>
                )}
              </div>

              {/* Mobile date filter toggle */}
              <button
                onClick={() => setShowMobileFilters((v) => !v)}
                className={`sm:hidden inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                  dateFilter !== "all"
                    ? "border-slate-700 bg-slate-800 text-white"
                    : "border-gray-200 bg-white text-slate-600"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Date
                {dateFilter !== "all" && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </button>
            </div>

            {/* Mobile collapsible date filter */}
            {showMobileFilters && (
              <div className="sm:hidden flex flex-col gap-2">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-slate-300"
                >
                  {DATE_FILTERS.map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label}
                    </option>
                  ))}
                </select>

                {dateFilter === "custom" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={customRange.start}
                      onChange={(e) =>
                        setCustomRange((r) => ({ ...r, start: e.target.value }))
                      }
                      className="flex-1 rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-slate-300"
                    />
                    <span className="text-gray-300 text-xs">to</span>
                    <input
                      type="date"
                      value={customRange.end}
                      onChange={(e) =>
                        setCustomRange((r) => ({ ...r, end: e.target.value }))
                      }
                      className="flex-1 rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-slate-300"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Status filter chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {STATUS_FILTERS.map((f) => {
                const isActive = statusFilter === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => setStatusFilter(f.key)}
                    className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                      isActive
                        ? "bg-slate-800 border-slate-800 text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {f.label}
                    <span
                      className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-semibold px-1 ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {statusCounts[f.key]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results bar */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              <span className="font-semibold text-slate-600">
                {filteredOrders.length}
              </span>{" "}
              {filteredOrders.length === 1 ? "order" : "orders"} found
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* ── Order Cards ── */}
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => {
            const isCancelled = order.status === "Cancelled";
            const isDelivered = order.status === "Delivered";
            const isRefunded = order.refundStatus === "Refunded";
            const isRefundProcessing = refundLoading.has(order._id);
            const statusCfg =
              STATUS_CONFIG[order.status] || STATUS_CONFIG["Order Placed"];

            const isCOD = order.paymentMethod === "COD";
            const showCancelledControls =
              isCancelled && !isRefunded && order.payment && !isCOD;
            const showStatusSelect = !isCancelled && !isDelivered;
            const hasBottomControls = showCancelledControls || showStatusSelect;

            return (
              <div
                key={order._id}
                className={`rounded-2xl border bg-white shadow-sm overflow-hidden transition-shadow duration-200 hover:shadow-md ${
                  isCancelled ? "border-red-100 opacity-80" : "border-gray-200"
                }`}
              >
                {/* Status progress bar */}
                <div className="h-1 bg-gray-100 w-full">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${statusCfg.bar} ${statusCfg.barColor}`}
                  />
                </div>

                <div className="p-4 sm:p-6">
                  {/* Top row: customer + amount */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 font-semibold text-sm uppercase select-none">
                        {order.address.firstName?.[0]}
                        {order.address.lastName?.[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-slate-800 truncate">
                          {order.address.firstName} {order.address.lastName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {order.address.phone}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                        Total
                      </p>
                      <p
                        className={`text-xl sm:text-2xl font-bold leading-none ${
                          isCancelled
                            ? "text-gray-400 line-through"
                            : "text-slate-900"
                        }`}
                      >
                        {currency}
                        {order.amount}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 mb-4" />

                  {/* Items */}
                  <div className="mb-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">
                      Items
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {order.items.map((item, i) => (
                        <span
                          key={i}
                          className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${
                            isCancelled
                              ? "bg-gray-50 border-gray-100 text-gray-400"
                              : "bg-slate-50 border-slate-100 text-slate-600"
                          }`}
                        >
                          {item.name}
                          <span className="mx-1 text-slate-300">·</span>×
                          {item.quantity}
                          <span className="ml-1 text-slate-400">
                            ({item.size})
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-4 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-400" />
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {order.address.street}, {order.address.city},{" "}
                        {order.address.state}, {order.address.country} —{" "}
                        {order.address.zipcode}
                      </p>
                    </div>
                  </div>

                  {/* Bottom: badges + status selector */}
                  <div
                    className={`flex flex-col gap-3 sm:flex-row sm:items-center ${
                      hasBottomControls ? "sm:justify-between" : ""
                    }`}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600">
                        <Package className="w-3 h-3" />
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                        {order.paymentMethod}
                      </span>

                      {!(isCOD && isCancelled) && (
                        <span
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium border ${
                            order.payment || (isCOD && isDelivered)
                              ? "bg-green-50 text-green-700 border-green-100"
                              : "bg-yellow-50 text-yellow-700 border-yellow-100"
                          }`}
                        >
                          <span
                            className={`inline-block w-1.5 h-1.5 rounded-full ${
                              order.payment || (isCOD && isDelivered)
                                ? "bg-green-500"
                                : "bg-yellow-400"
                            }`}
                          />
                          {order.payment || (isCOD && isDelivered)
                            ? "Paid"
                            : "Pending"}
                        </span>
                      )}

                      <span
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${statusCfg.pill}`}
                      >
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                        />
                        {order.status}
                      </span>

                      {isRefunded && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-green-50 border border-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                          Refunded
                        </span>
                      )}
                    </div>

                    {showCancelledControls && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-500">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400" />
                          Cancelled
                        </div>

                        {order.payment && (
                          <button
                            onClick={() => handleRefund(order._id)}
                            disabled={isRefundProcessing}
                            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
                              isRefundProcessing
                                ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                                : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-300 cursor-pointer"
                            }`}
                          >
                            {isRefundProcessing ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Processing…
                              </>
                            ) : (
                              <>
                                <RotateCcw className="w-3 h-3" />
                                Process Refund
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}

                    {showStatusSelect && (
                      <select
                        value={order.status}
                        onChange={(e) => statusHandler(e, order._id)}
                        className="w-full sm:w-auto shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 hover:border-slate-300 cursor-pointer"
                      >
                        <option>Order Placed</option>
                        <option>Packing</option>
                        <option>Shipped</option>
                        <option>Out for delivery</option>
                        <option>Delivered</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Empty States ── */}
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-gray-200 shadow-sm mb-4">
              <img
                src={assets.parcel_icon}
                alt=""
                className="w-7 h-7 opacity-40"
              />
            </div>
            <p className="text-sm font-medium text-gray-500">No orders yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Orders will appear here once placed
            </p>
          </div>
        )}

        {orders.length > 0 && filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-gray-200 shadow-sm mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              No matching orders
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
            >
              <X className="w-3.5 h-3.5" />
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
