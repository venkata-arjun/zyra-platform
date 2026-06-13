import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  cancelOrder,
  verifyStripe,
  verifyRazorpay,
  updateOrderStatus,
  verifyDeliveryOtp,
} from "../controllers/orderController.js";

import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// ====================== ADMIN ROUTES ======================

// Get all orders (Admin)
orderRouter.post("/list", adminAuth, allOrders);

// Update order status (Admin / Delivery Partner)
orderRouter.patch("/:id/status", adminAuth, updateOrderStatus);

// Verify Delivery OTP & Mark as Delivered (Admin / Delivery)
orderRouter.post("/:id/verify-otp", adminAuth, verifyDeliveryOtp);

// Process Refund (Admin)
orderRouter.post("/refund", adminAuth, async (req, res) => {
  // Keeping this route for now if you still need it
  // You can remove it later if not used
  return res.status(410).json({
    success: false,
    message: "This endpoint has been deprecated. Use status update instead.",
  });
});

// ====================== PAYMENT & USER ROUTES ======================

// Place Order - COD
orderRouter.post("/place", authUser, placeOrder);

// Place Order - Stripe
orderRouter.post("/stripe", authUser, placeOrderStripe);

// Place Order - Razorpay
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

// Get User's Orders
orderRouter.post("/userorders", authUser, userOrders);

// Cancel Order (User)
orderRouter.post("/cancel", authUser, cancelOrder);

// Verify Stripe Payment
orderRouter.post("/verifyStripe", authUser, verifyStripe);

// Verify Razorpay Payment
orderRouter.post("/verifyRazorpay", authUser, verifyRazorpay);

export default orderRouter;
