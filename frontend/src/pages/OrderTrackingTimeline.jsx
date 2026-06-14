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
  ChevronDown,
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
  const createdAt = order.createdAt || order.date;

  return [
    {
      key: "Order Placed",
      Icon: ClipboardCheck,
      label: "Order placed",
      location: "ZYRA Store, Bhimavaram, Andhra Pradesh",
      _fallbackTime: createdAt,
    },
    {
      key: "Packing",
      Icon: Package,
      label: "Packing",
      location: "ZYRA Warehouse, Bhimavaram",
      _fallbackTime: addMinutes(createdAt, 20),
    },
    {
      key: "Shipped",
      Icon: Truck,
      label: "Shipped",
      location: "ZYRA Dispatch Center, Bhimavaram",
      _fallbackTime: addMinutes(createdAt, 120),
    },
    {
      key: "Out for delivery",
      Icon: MapPinned,
      label: "Out for delivery",
      location: `${a.city || ""}, ${a.state || ""}`.replace(/^, |, $/g, ""),
      _fallbackTime: addMinutes(createdAt, 420),
    },
    {
      key: "Delivered",
      Icon: PackageCheck,
      label: "Delivered",
      location: `${a.street ? a.street + ", " : ""}${a.city || ""}`,
      _fallbackTime: addMinutes(createdAt, 500),
    },
  ];
}

// ─── inline description renderer ─────────────────────────────────────────────

function DescriptionSegments({ segments }) {
  return (
    <p className="text-[13px] leading-relaxed text-slate-600">
      {segments.map((seg, i) =>
        seg.dynamic ? (
          <span key={i} className="text-slate-900 font-medium">
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
    <div className="mt-4 rounded-lg border border-slate-200 bg-gray-50 shadow-sm p-2.5 w-full">
      <div className="flex items-start gap-2 mb-2">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] sm:text-xs text-slate-600 leading-snug">
          Share this code with the delivery agent to confirm receipt.
        </p>
      </div>

      <div className="flex items-center justify-center gap-1.5 mb-2">
        {otp.split("").map((digit, i) => (
          <span
            key={i}
            className="w-7 h-8 sm:w-8 sm:h-9 flex items-center justify-center bg-white border border-slate-300 rounded text-base sm:text-lg font-bold text-slate-900 font-mono select-none"
          >
            {digit}
          </span>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border transition-all duration-150 active:scale-[0.97] focus:outline-none ${
            copied
              ? "text-green-700 border-green-200 bg-green-50"
              : "text-slate-700 border-slate-200 bg-white hover:bg-slate-100"
          }`}
          aria-label="Copy OTP"
        >
          <Copy className="w-3.5 h-3.5 flex-shrink-0" />
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>
    </div>
  );
}

// ─── single step ──────────────────────────────────────────────────────────────

function TrackingStep({
  step,
  state,
  isFirst,
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
    <div
      className={`relative flex gap-3 sm:gap-4 ${isLast ? "" : "mb-4 sm:mb-5"}`}
    >
      {/* Connector above */}
      {!isFirst && (
        <div
          className={`absolute left-[13px] sm:left-[15px] -top-px h-3 sm:h-4 w-px ${
            completed || current ? "bg-slate-300" : "bg-slate-200"
          }`}
        />
      )}
      {/* Connector below — extends through the margin gap */}
      {!isLast && (
        <div
          className={`absolute left-[13px] sm:left-[15px] top-[28px] sm:top-[32px] w-px ${
            completed ? "bg-slate-300" : "bg-slate-200"
          }`}
          style={{ bottom: "-1.25rem" }}
        />
      )}

      {/* Icon bubble — completed AND current both fill solid black */}
      <button
        type="button"
        onClick={isClickable ? onToggle : undefined}
        disabled={!isClickable}
        className={`relative z-10 flex-shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
          completed || current
            ? "bg-slate-900 border-slate-900 text-white"
            : "bg-white border-slate-200 text-slate-300"
        }`}
        aria-label={
          isClickable
            ? `${expanded ? "Collapse" : "Expand"} ${step.label}`
            : undefined
        }
      >
        {/* Always show checkmark for completed or current; icon for pending */}
        {completed || current ? (
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        ) : (
          <step.Icon className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {pending ? (
          <div className="flex items-center h-7">
            <p className="text-sm text-slate-400">{step.label}</p>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={onToggle}
              className="w-full flex items-center justify-between gap-2 text-left"
            >
              <div className="min-w-0">
                <p className="text-sm sm:text-[15px] font-semibold tracking-tight text-slate-900">
                  {step.label}
                </p>
                {timeStr && (
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
                    {timeStr}
                    {step.location ? ` · ${step.location}` : ""}
                  </p>
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                expanded
                  ? "max-h-[500px] opacity-100 mt-2.5"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="rounded-lg p-3 border border-slate-100 bg-slate-50/60">
                <DescriptionSegments segments={step.descriptionSegments} />
              </div>
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

  const currentStep = stepsResolved[currentIndex];
  const isDelivered = currentStep?.key === "Delivered";

  // When delivered every step is "completed" — no "current" state needed
  const getState = (i) => {
    if (isDelivered) {
      // All steps completed — the timeline is fully done
      return i <= currentIndex ? "completed" : "pending";
    }
    if (i < currentIndex) return "completed";
    if (i === currentIndex) return "current";
    return "pending";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Status summary header — hidden when delivered to avoid duplicate label */}
      {!isDelivered && (
        <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-0.5">
              Current status
            </p>
            <p className="text-base sm:text-lg font-semibold text-slate-900 truncate">
              {currentStep?.label}
            </p>
          </div>
          <span className="inline-flex items-center flex-shrink-0 rounded-full font-medium whitespace-nowrap px-2.5 py-1 text-[11px] sm:text-xs bg-slate-100 text-slate-900 border border-slate-200">
            Step {currentIndex + 1} of {stepsResolved.length}
          </span>
        </div>
      )}

      {/* Timeline */}
      <div className="px-1">
        {stepsResolved.map((step, i) => (
          <TrackingStep
            key={step.key}
            step={step}
            state={getState(i)}
            isFirst={i === 0}
            isLast={i === stepsResolved.length - 1}
            expanded={expandedIndex === i}
            onToggle={() => handleToggle(i)}
            deliveryOtp={order.deliveryOtp ?? null}
          />
        ))}
      </div>
    </div>
  );
}
