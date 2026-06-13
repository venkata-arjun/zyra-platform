import React, { useContext, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { OrderTrackingTimeline } from "./OrderTrackingTimeline";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Copy,
  RefreshCw,
  Check,
  CheckCircle2,
  X,
  ClipboardList,
  Package,
  Truck,
  Route as RouteIcon,
  PackageCheck,
  MapPin,
  CreditCard,
  Receipt,
  AlertTriangle,
} from "lucide-react";

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

const STEPS = [
  {
    key: "Order Placed",
    label: "Order Placed",
    icon: <ClipboardList className="w-4 h-4" />,
  },
  { key: "Packing", label: "Packing", icon: <Package className="w-4 h-4" /> },
  { key: "Shipped", label: "Shipped", icon: <Truck className="w-4 h-4" /> },
  {
    key: "Out for delivery",
    label: "Out for Delivery",
    icon: <RouteIcon className="w-4 h-4" />,
  },
  {
    key: "Delivered",
    label: "Delivered",
    icon: <PackageCheck className="w-4 h-4" />,
  },
];

const DELIVERY_CHARGE = 10;

const OrderDetails = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchOrder = async (silent = false) => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      if (silent) setRefreshing(true);

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } },
      );

      if (response.data.success) {
        const found = response.data.orders.find((o) => o._id === orderId);
        if (found) {
          setOrder(found);
        } else if (!silent) {
          toast.error("Order not found");
          navigate("/orders");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!order) fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, orderId]);

  const cancelOrder = async () => {
    try {
      setCancelLoading(true);
      const response = await axios.post(
        backendUrl + "/api/order/cancel",
        { orderId },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setCancelOpen(false);
        fetchOrder(true);
      } else {
        toast.error(response.data.message);
        setCancelOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setCancelLoading(false);
    }
  };

  const copyOrderId = () => {
    if (!order?._id) return;
    navigator.clipboard
      .writeText(order._id)
      .then(() => toast.success("Order ID copied"))
      .catch(() => toast.error("Couldn't copy Order ID"));
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="border-t border-gray-200 pt-8 sm:pt-14 px-4 sm:px-6 lg:px-0 pb-20 max-w-5xl mx-auto">
        <div className="h-6 w-44 bg-gray-100 rounded mb-6 animate-pulse" />
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
          <div className="space-y-5">
            <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="border-t border-gray-200 pt-14 px-4 pb-20 max-w-5xl mx-auto text-center">
        <p className="text-sm text-gray-400">Order not found.</p>
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 text-sm font-semibold text-gray-900 underline"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "Cancelled";
  const canCancel =
    order.status === "Order Placed" || order.status === "Packing";
  const isRefunded = order.refundStatus === "Refunded";
  const totalItems = order.items.reduce(
    (sum, it) => sum + Number(it.quantity || 0),
    0,
  );
  const subtotal = order.items.reduce(
    (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0),
    0,
  );
  const deliveryFee = Math.max(order.amount - subtotal, 0) || DELIVERY_CHARGE;
  const a = order.address || {};

  const getStepDate = (step, i) => {
    if (i === 0) return order.date;
    const entry = order.statusHistory?.find((h) => h.status === step.key);
    return entry?.date;
  };

  return (
    <div className="border-t border-gray-200 pt-8 sm:pt-14 px-4 sm:px-6 lg:px-0 pb-28 lg:pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/orders")}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Order Details
            </h1>
            <button
              onClick={copyOrderId}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 font-mono mt-0.5 transition-colors"
            >
              <span className="truncate max-w-[180px] sm:max-w-none">
                ID: {order._id}
              </span>
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <span
          className={`self-start sm:self-auto inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full whitespace-nowrap ${getStatusStyle(order.status)}`}
        >
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-50"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
          </span>
          {order.status}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* ── Left column ───────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-4 h-4" />
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Items ({totalItems})
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                    <img
                      className="w-full h-full object-cover object-top"
                      src={item.image[0]}
                      alt={item.name}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 sm:truncate">
                      {item.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="text-xs px-2 py-0.5 border border-gray-200 bg-gray-50 text-gray-600 rounded-sm uppercase tracking-wider font-medium">
                        Size: {item.size}
                      </span>
                      <span className="text-xs px-2 py-0.5 border border-gray-200 bg-gray-50 text-gray-600 rounded-sm uppercase tracking-wider font-medium">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                    {currency}
                    {item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Tracking
              </h2>
              <button
                onClick={() => fetchOrder(true)}
                disabled={refreshing}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 disabled:opacity-50 transition-colors"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {isCancelled ? (
              <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 p-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-700">
                    This order was cancelled
                  </p>
                  {order.cancelledAt && (
                    <p className="text-xs text-red-500 mt-0.5">
                      Cancelled on{" "}
                      {new Date(order.cancelledAt).toLocaleString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  )}

                  {/* Refund status — only shown for paid non-COD orders */}
                  {order.payment && order.paymentMethod !== "COD" && (
                    <div className="mt-3 pt-3 border-t border-red-100">
                      {isRefunded ? (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                          <span className="inline-flex items-center gap-1.5 self-start whitespace-nowrap text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg px-2.5 py-1">
                            <CheckCircle2
                              className="w-3 h-3 flex-shrink-0"
                              strokeWidth={2.5}
                            />
                            Refund Processed
                          </span>
                          {order.refundDate && (
                            <span className="text-xs text-red-400">
                              on{" "}
                              {new Date(order.refundDate).toLocaleString(
                                undefined,
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-red-500">
                          Refund status:{" "}
                          <span className="font-medium">
                            {order.refundStatus || "Pending review by admin"}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <OrderTrackingTimeline
                order={order}
                currentIndex={currentIndex}
              />
            )}
          </div>
        </div>

        {/* ── Right column ──────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Price summary */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="w-4 h-4" />
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Order Summary
              </h2>
            </div>
            <div className="text-sm text-gray-600 space-y-2.5">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="text-gray-900">
                  {currency}
                  {subtotal}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Fee</span>
                <span className="text-gray-900">
                  {currency}
                  {deliveryFee}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-base font-bold text-gray-900">
                  {currency}
                  {order.amount}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4" />
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Shipping Address
              </h2>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed space-y-0.5">
              <p className="font-medium text-gray-900">
                {a.firstName} {a.lastName}
              </p>
              {a.street && <p>{a.street}</p>}
              <p>
                {a.city}
                {a.city && a.state ? ", " : ""}
                {a.state} {a.zipcode}
              </p>
              {a.country && <p>{a.country}</p>}
              {a.phone && <p className="mt-1.5">Phone: {a.phone}</p>}
              {a.email && <p className="truncate">Email: {a.email}</p>}
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4" />
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Payment
              </h2>
            </div>
            <div className="text-sm text-gray-600 space-y-2.5">
              <div className="flex items-center justify-between">
                <span>Method</span>
                <span className="font-medium text-gray-900">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    order.payment
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {order.payment
                    ? "Paid"
                    : order.paymentMethod === "COD"
                      ? "Pay on Delivery"
                      : "Pending"}
                </span>
              </div>
              {/* Refund row — shown only when refunded */}
              {isRefunded && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span>Refund</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700">
                    Processed
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Cancel button — desktop */}
          {canCancel && (
            <button
              onClick={() => setCancelOpen(true)}
              className="hidden lg:flex w-full items-center justify-center gap-1.5 border border-red-200 bg-red-50 px-5 py-3 text-xs font-semibold tracking-wider uppercase rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Sticky cancel bar — mobile */}
      {canCancel && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur-sm px-4 py-3">
          <button
            onClick={() => setCancelOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 border border-red-200 bg-red-50 px-5 py-3 text-xs font-semibold tracking-wider uppercase rounded-xl text-red-600 active:bg-red-600 active:text-white transition-all duration-200"
          >
            Cancel Order
          </button>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !cancelLoading && setCancelOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <AlertTriangle className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Cancel Order?
              </h3>
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
              <div className="mt-3 flex w-full gap-3">
                <button
                  onClick={() => setCancelOpen(false)}
                  disabled={cancelLoading}
                  className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Keep Order
                </button>
                <button
                  onClick={cancelOrder}
                  disabled={cancelLoading}
                  className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {cancelLoading ? "Cancelling..." : "Cancel Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
