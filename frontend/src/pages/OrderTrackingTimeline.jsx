/**
 * Drop-in replacement for the vertical tracking timeline inside OrderDetails.jsx
 *
 * Usage:
 *   <OrderTrackingTimeline order={order} currentIndex={currentIndex} />
 */

import { useState, useMemo } from "react";
import {
  ClipboardCheck,
  Package,
  Truck,
  MapPinned,
  PackageCheck,
  MapPin,
  Check,
  Copy,
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

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ─── description builder — returns segments, not a plain string ───────────────
// Each segment: { text: string, dynamic: boolean }

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
      locationDynamic: [],
      _fallbackTime: createdAt,
    },
    {
      key: "Packing",
      Icon: Package,
      label: "Packing",
      location: "ZYRA Warehouse • Bhimavaram",
      locationDynamic: [],
      _fallbackTime: addMinutes(createdAt, 20),
    },
    {
      key: "Shipped",
      Icon: Truck,
      label: "Shipped",
      location: "ZYRA Dispatch Center • Bhimavaram",
      locationDynamic: [],
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
    <p className="text-xs leading-relaxed">
      {segments.map((seg, i) =>
        seg.dynamic ? (
          <span key={i} className="text-gray-900 font-medium">
            {seg.text}
          </span>
        ) : (
          <span key={i} className="text-gray-400">
            {seg.text}
          </span>
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
    <div className="mt-2.5 rounded-xl bg-gray-50 border border-gray-100 p-3 sm:p-3.5">
      <p className="text-xs text-gray-400 leading-relaxed mb-2">
        Share this OTP with the delivery partner to confirm delivery.
      </p>
      <div className="flex items-center gap-2.5">
        {/* Individual digit boxes */}
        <div className="flex gap-1.5">
          {otp.split("").map((digit, i) => (
            <span
              key={i}
              className="w-8 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-base font-semibold text-gray-900 select-none"
            >
              {digit}
            </span>
          ))}
        </div>

        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors duration-200 whitespace-nowrap focus:outline-none ${
            copied
              ? "text-green-700 border-green-200 bg-green-50"
              : "text-gray-700 border-gray-200 bg-white hover:bg-gray-50 active:scale-95"
          }`}
          aria-label="Copy OTP"
        >
          <Copy className="w-3 h-3" />
          {copied ? "Copied!" : "Copy OTP"}
        </button>
      </div>
    </div>
  );
}

// ─── single step ──────────────────────────────────────────────────────────────

function TrackingStep({ step, state, isLast, expanded, onToggle, otp }) {
  const completed = state === "completed";
  const current = state === "current";
  const pending = state === "pending";

  const timeStr = completed || current ? fmtDateTime(step.time) : null;
  const isClickable = completed || current;

  const locationLines = step.locationLines
    ? step.locationLines.filter((l) => l.text)
    : (step.location || "")
        .split("\n")
        .map((t) => ({ text: t, dynamic: false }));

  return (
    <div className="relative flex gap-3.5">
      {/* Connector line */}
      {!isLast && (
        <span
          className={`absolute left-[15px] top-9 w-px bottom-0 transition-colors duration-500 ${
            completed ? "bg-gray-900" : "bg-gray-200"
          }`}
        />
      )}

      {/* Icon bubble */}
      <button
        type="button"
        onClick={isClickable ? onToggle : undefined}
        disabled={!isClickable}
        className={`relative flex-shrink-0 z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 focus:outline-none ${
          completed
            ? "bg-gray-900 border-gray-900 text-white cursor-pointer hover:scale-110"
            : current
              ? "bg-white border-gray-900 text-gray-900 scale-105 cursor-pointer hover:scale-110"
              : "bg-gray-50 border-gray-200 text-gray-300 cursor-default"
        }`}
        aria-label={
          isClickable
            ? `${expanded ? "Collapse" : "Expand"} ${step.label}`
            : undefined
        }
      >
        {completed ? (
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        ) : (
          <step.Icon className="w-3.5 h-3.5" />
        )}
        {current && (
          <span className="absolute inset-0 rounded-full border-2 border-gray-900 animate-ping opacity-25" />
        )}
      </button>

      {/* Right side */}
      <div className={`flex-1 ${isLast ? "pb-1" : "pb-4"}`}>
        {/* PENDING: label only */}
        {pending ? (
          <div className="flex items-center h-8">
            <p className="text-sm text-gray-300 font-medium">{step.label}</p>
          </div>
        ) : (
          <>
            {/* Always visible: label + time */}
            <div
              className="flex flex-col justify-center h-8 cursor-pointer select-none"
              onClick={onToggle}
            >
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                {step.label}
              </p>
              {timeStr && (
                <span className="text-xs text-gray-400 leading-tight">
                  {timeStr}
                </span>
              )}
            </div>

            {/* Expanded detail */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expanded ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
              }`}
            >
              <div
                className={`rounded-xl p-3 sm:p-3.5 ${
                  current
                    ? "border-2 border-gray-900 bg-white shadow-sm"
                    : "border border-gray-100 bg-white"
                }`}
              >
                {/* Description */}
                <DescriptionSegments segments={step.descriptionSegments} />
              </div>

              {/* OTP card — only for "Out for delivery" */}
              {step.key === "Out for delivery" && otp && <OtpCard otp={otp} />}
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

  // Generate OTP once per order; stable across re-renders
  const otp = useMemo(() => generateOtp(), []);

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
    <div className="relative">
      {stepsResolved.map((step, i) => {
        const state =
          i < currentIndex
            ? "completed"
            : i === currentIndex
              ? "current"
              : "pending";
        return (
          <TrackingStep
            key={step.key}
            step={step}
            state={state}
            isLast={i === stepsResolved.length - 1}
            expanded={expandedIndex === i}
            onToggle={() => handleToggle(i)}
            otp={otp}
          />
        );
      })}
    </div>
  );
}
