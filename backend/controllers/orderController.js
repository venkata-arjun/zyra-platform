import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";

// Global variables
const currency = "inr";
const deliveryCharge = 10;

// Gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Generate 6-digit OTP
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Placing orders using COD Method
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      status: "Order Placed",
      statusHistory: [{ status: "Order Placed", date: Date.now() }],
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Order Placed",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
      status: "Order Placed",
      statusHistory: [{ status: "Order Placed", date: Date.now() }],
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = [
      ...items.map((item) => ({
        price_data: {
          currency: currency,
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      {
        price_data: {
          currency: currency,
          product_data: { name: "Delivery Charges" },
          unit_amount: deliveryCharge * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Verify Stripe Payment
const verifyStripe = async (req, res) => {
  try {
    const { orderId, success } = req.body;
    const userId = req.userId;

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        status: "Order Placed", // Ensure status is consistent
      });

      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Placing Orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
      status: "Order Placed",
      statusHistory: [{ status: "Order Placed", date: Date.now() }],
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: Math.round(amount * 100), // Ensure integer
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const userId = req.userId;

    // Basic validation
    if (!razorpay_order_id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
        status: "Order Placed",
      });

      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// All Orders for Admin
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// User Orders
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    let orders = await orderModel.find({ userId }).sort({ date: -1 });

    const oneDay = 24 * 60 * 60 * 1000;

    for (const order of orders) {
      if (
        order.status === "Cancelled" &&
        order.paymentMethod !== "COD" &&
        order.refundStatus === "Refund Processing" &&
        order.cancelledAt &&
        Date.now() - order.cancelledAt >= oneDay
      ) {
        order.refundStatus = "Refunded";
        order.refundDate = Date.now();
        await order.save();
      }
    }

    // Return fresh data
    orders = await orderModel.find({ userId }).sort({ date: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Cancel Order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.userId;

    const order = await orderModel.findById(orderId);

    if (!order) return res.json({ success: false, message: "Order not found" });
    if (order.userId.toString() !== userId)
      return res.json({ success: false, message: "Unauthorized" });

    if (!["Order Placed", "Packing"].includes(order.status)) {
      return res.json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    const cancelledAt = Date.now();

    await orderModel.findByIdAndUpdate(orderId, {
      status: "Cancelled",
      cancelledAt,
      $push: { statusHistory: { status: "Cancelled", date: cancelledAt } },
      ...(order.paymentMethod !== "COD" && {
        refundStatus: "Refund Processing",
      }),
    });

    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Update Order Status (Admin / Delivery)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    if (status === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Use OTP verification to mark as Delivered",
      });
    }

    const order = await orderModel.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.status = status;
    order.statusHistory.push({ status, date: Date.now() });

    // Generate OTP only when moving to "Out for delivery"
    if (status === "Out for delivery" && !order.deliveryOtp) {
      order.deliveryOtp = generateOtp();
      order.otpVerified = false;
    }

    await order.save();

    res.json({
      success: true,
      message: "Status updated successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Delivery OTP
const verifyDeliveryOtp = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    if (!otp) {
      return res
        .status(400)
        .json({ success: false, message: "OTP is required" });
    }

    const order = await orderModel.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.status !== "Out for delivery") {
      return res.status(400).json({
        success: false,
        message: "Order is not out for delivery",
      });
    }

    if (order.otpVerified) {
      return res
        .status(400)
        .json({ success: false, message: "OTP already verified" });
    }

    const isMatch = crypto.timingSafeEqual(
      Buffer.from(order.deliveryOtp.padEnd(6, " ")),
      Buffer.from(String(otp).trim().padEnd(6, " ")),
    );

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Mark as Delivered
    order.status = "Delivered";
    order.otpVerified = true;
    order.statusHistory.push({ status: "Delivered", date: Date.now() });

    await order.save();

    res.json({
      success: true,
      message: "Order delivered successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
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
};
