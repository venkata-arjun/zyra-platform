import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";

// Global variables
const currency = "inr";
const deliveryCharge = 10;

// Gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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
      statusHistory: [{ status: "Order Placed", date: Date.now() }],
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Order Placed",
    });
  } catch (error) {
    console.log(error);
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
      statusHistory: [{ status: "Order Placed", date: Date.now() }],
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

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
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Verify Stripe Payment
const verifyStripe = async (req, res) => {
  const { orderId, success } = req.body;
  const userId = req.userId;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
      });

      await userModel.findByIdAndUpdate(userId, {
        cartData: {},
      });

      res.json({
        success: true,
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);

      res.json({
        success: false,
      });
    }
  } catch (error) {
    console.log(error);

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
      statusHistory: [{ status: "Order Placed", date: Date.now() }],
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.json({
          success: false,
          message: error,
        });
      }

      res.json({
        success: true,
        order,
      });
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const userId = req.userId;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });

      await userModel.findByIdAndUpdate(userId, {
        cartData: {},
      });

      res.json({
        success: true,
      });
    } else {
      res.json({
        success: false,
      });
    }
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// User Order Data For Frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;

    let orders = await orderModel.find({ userId });

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

    // Fetch latest data after updates
    orders = await orderModel.find({ userId });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel Order (User)
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.userId;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    // Ensure the order belongs to the requesting user
    if (order.userId.toString() !== userId) {
      return res.json({
        success: false,
        message: "You are not authorized to cancel this order",
      });
    }

    // Only allow cancellation before shipping
    if (order.status !== "Order Placed" && order.status !== "Packing") {
      return res.json({
        success: false,
        message: "This order cannot be cancelled",
      });
    }

    const cancelledAt = Date.now();

    const updateData = {
      status: "Cancelled",
      cancelledAt,
      $push: { statusHistory: { status: "Cancelled", date: cancelledAt } },
    };

    // Refund status only for prepaid orders
    if (order.paymentMethod !== "COD") {
      updateData.refundStatus = "Refund Processing";
    }

    await orderModel.findByIdAndUpdate(orderId, updateData);

    res.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Update Order Status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, {
      status,
      $push: { statusHistory: { status, date: Date.now() } },
    });

    res.json({
      success: true,
      message: "Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const processRefund = async (req, res) => {
  try {
    const { orderId } = req.body;

    await orderModel.findByIdAndUpdate(orderId, {
      refundStatus: "Refunded",
      refundDate: Date.now(),
    });

    res.json({
      success: true,
      message: "Refund processed",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  processRefund,
  cancelOrder,
  updateStatus,
  verifyStripe,
  verifyRazorpay,
};
