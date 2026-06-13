/**
 * Drop-in replacement for the vertical tracking timeline inside OrderDetails.jsx
 *
 * Usage:
 *   <OrderTrackingTimeline order={order} currentIndex={currentIndex} />
 *
 * The `order` prop is expected to include `deliveryOtp` from the backend,
 * populated when the order status moves to "Out for delivery".
 */

import { useState } from "react";
import {
  ClipboardCheck,
  Package,
  Truck,
  MapPinned,
  PackageCheck,
  Check,
  Copy,
  ShieldCheck,
} from "lucide-react";

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmtDateTime(date) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

function addMinutes(date, mins) {
  return new Date(new Date(date).getTime() + mins * 60_000);
}

// ─── description builder ──────────────────────────────────────────────────────

function getDescriptionSegments(key, time, order) {
  const a = order.address || {};
  const fullName = [a.firstName, a.lastName].filter(Boolean).join(" ");
  const t = fmtDateTime(time);

  const d = (text) => ({ text, dynamic: true });
  const s = (text) => ({ text, dynamic: false });

  switch (key) {
    case "Order Placed":
      return [
        s("Order placed by "),
        d(fullName),
        s(" on "),
        d(t),
        s(". Your order has been confirmed and is being processed."),
      ];
    case "Packing":
      return [
        s("Your order reached our Bhimavaram warehouse on "),
        d(t),
        s(". Our team is packing your items and completing quality checks."),
      ];
    case "Shipped":
      return [
        s("Your package left our Bhimavaram dispatch center on "),
        d(t),
        s(" and is on its way to "),
        d(a.city),
        s("."),
      ];
    case "Out for delivery":
      return [
        s("Your package reached the "),
        d(a.city),
        s(" delivery hub on "),
        d(t),
        s(" and is out for delivery to "),
        d(fullName),
        s("."),
      ];
    case "Delivered":
      return [
        s("Package delivered to "),
        d(fullName),
        s(" on "),
        d(t),
        s(" at "),
        d(a.street),
        s(", "),
        d(a.city),
        s(". Thank you for shopping with ZYRA."),
      ];
    default:
      return [];
  }
}

// ─── step skeleton ────────────────────────────────────────────────────────────

function buildSteps(order) {
  const a = order.address || {};
  const fullName = [a.firstName, a.lastName].filter(Boolean).join(" ");
  const createdAt = order.createdAt || order.date;

  return [
    {
      key: "Order Placed",
      Icon: ClipboardCheck,
      label: "Order Placed",
      location: "ZYRA Store • Bhimavaram, Andhra Pradesh",
      _fallbackTime: createdAt,
    },
    {
      key: "Packing",
      Icon: Package,
      label: "Packing",
      location: "ZYRA Warehouse • Bhimavaram",
      _fallbackTime: addMinutes(createdAt, 20),
    },
    {
      key: "Shipped",
      Icon: Truck,
      label: "Shipped",
      location: "ZYRA Dispatch Center • Bhimavaram",
      _fallbackTime: addMinutes(createdAt, 120),
    },
    {
      key: "Out for delivery",
      Icon: MapPinned,
      label: "Out for Delivery",
      locationLines: [{ text: `${a.city}, ${a.state}`, dynamic: true }],
      _fallbackTime: addMinutes(createdAt, 420),
    },
    {
      key: "Delivered",
      Icon: PackageCheck,
      label: "Delivered",
      locationLines: [
        { text: fullName, dynamic: true },
        { text: a.street, dynamic: true },
        { text: `${a.city}, ${a.state}`, dynamic: true },
      ],
      _fallbackTime: addMinutes(createdAt, 500),
    },
  ];
}

// ─── inline description renderer ─────────────────────────────────────────────

function DescriptionSegments({ segments }) {
  return (
    <p className="text-sm sm:text-xs leading-relaxed text-gray-600">
      {segments.map((seg, i) =>
        seg.dynamic ? (
          <span key={i} className="text-gray-900 font-medium">
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </p>
  );
}

// ─── OTP card ─────────────────────────────────────────────────────────────────

function OtpCard({ otp }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(otp).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3 rounded-2xl bg-gray-50 border border-gray-100 p-3 sm:p-3.5">
      {/* Header */}
      <div className="flex items-start gap-2 mb-2.5">
        <ShieldCheck className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-snug">
          Share this OTP with the delivery partner to confirm delivery.
        </p>
      </div>

      {/* Digits + copy button */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Fixed-size digit boxes */}
        <div className="flex gap-1.5 flex-shrink-0">
          {otp.split("").map((digit, i) => (
            <span
              key={i}
              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-base font-semibold text-gray-900 select-none shadow-sm"
            >
              {digit}
            </span>
          ))}
        </div>

        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`flex-1 sm:flex-none sm:ml-auto flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border transition-all duration-200 active:scale-[0.97] focus:outline-none ${
            copied
              ? "text-green-700 border-green-200 bg-green-50"
              : "text-gray-700 border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100"
          }`}
          aria-label="Copy OTP"
        >
          <Copy className="w-4 h-4 flex-shrink-0" />
          {copied ? "Copied!" : "Copy OTP"}
        </button>
      </div>
    </div>
  );
}

// ─── single step ──────────────────────────────────────────────────────────────

function TrackingStep({
  step,
  state,
  isLast,
  expanded,
  onToggle,
  deliveryOtp,
}) {
  const completed = state === "completed";
  const current = state === "current";
  const pending = state === "pending";

  const timeStr = completed || current ? fmtDateTime(step.time) : null;
  const isClickable = completed || current;

  return (
    <div className="relative flex gap-4 sm:gap-5 group">
      {/* Connector line */}
      {!isLast && (
        <div
          className={`absolute left-[15px] top-[42px] bottom-0 w-px transition-colors duration-500 ${
            completed ? "bg-gray-900" : "bg-gray-200"
          }`}
        />
      )}

      {/* Icon bubble */}
      <button
        type="button"
        onClick={isClickable ? onToggle : undefined}
        disabled={!isClickable}
        className={`relative z-10 flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border-2 transition-all duration-300 focus:outline-none active:scale-95 ${
          completed
            ? "bg-gray-900 border-gray-900 text-white hover:scale-105"
            : current
              ? "bg-white border-gray-900 text-gray-900 scale-105 shadow-md hover:scale-110"
              : "bg-gray-50 border-gray-200 text-gray-300"
        }`}
        aria-label={
          isClickable
            ? `${expanded ? "Collapse" : "Expand"} ${step.label}`
            : undefined
        }
      >
        {completed ? (
          <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={3.5} />
        ) : (
          <step.Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        )}
        {current && (
          <span className="absolute inset-0 rounded-2xl border-2 border-gray-900 animate-ping opacity-20" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1 pb-6 sm:pb-7 last:pb-1">
        {pending ? (
          <div className="flex items-center h-9">
            <p className="text-sm sm:text-base text-gray-400 font-medium">
              {step.label}
            </p>
          </div>
        ) : (
          <>
            {/* Always visible header */}
            <div
              className="flex justify-between items-start cursor-pointer select-none pr-1"
              onClick={onToggle}
            >
              <div>
                <p className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight">
                  {step.label}
                </p>
                {timeStr && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {timeStr}
                  </p>
                )}
              </div>
            </div>

            {/* Expanded content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                expanded
                  ? "max-h-[500px] opacity-100 mt-4"
                  : "max-h-0 opacity-0"
              }`}
            >
              {/* Description */}
              <div
                className={`rounded-2xl p-4 sm:p-5 border transition-colors ${
                  current
                    ? "border-gray-900 bg-white shadow"
                    : "border-gray-100 bg-white"
                }`}
              >
                <DescriptionSegments segments={step.descriptionSegments} />
              </div>

              {/* OTP Card */}
              {step.key === "Out for delivery" && deliveryOtp && (
                <OtpCard otp={deliveryOtp} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── main export ──────────────────────────────────────────────────────────────

export function OrderTrackingTimeline({ order, currentIndex }) {
  const steps = buildSteps(order);

  const stepsResolved = steps.map((step, i) => {
    const historyEntry = order.statusHistory?.find(
      (h) => h.status === step.key,
    );
    const time =
      i === 0
        ? order.date || order.createdAt
        : historyEntry?.date || step._fallbackTime;

    return {
      ...step,
      time,
      descriptionSegments: getDescriptionSegments(step.key, time, order),
    };
  });

  const [expandedIndex, setExpandedIndex] = useState(currentIndex);

  const handleToggle = (i) => {
    setExpandedIndex((prev) => (prev === i ? null : i));
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-1">
      {stepsResolved.map((step, i) => (
        <TrackingStep
          key={step.key}
          step={step}
          state={
            i < currentIndex
              ? "completed"
              : i === currentIndex
                ? "current"
                : "pending"
          }
          isLast={i === stepsResolved.length - 1}
          expanded={expandedIndex === i}
          onToggle={() => handleToggle(i)}
          deliveryOtp={order.deliveryOtp ?? null}
        />
      ))}
    </div>
  );
}
