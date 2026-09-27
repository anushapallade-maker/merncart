// routes/orderRoutes.js
const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order (any logged-in user)
router.post("/", protect, async (req, res) => {
  try {
    const { items } = req.body;
    // items should look like: [{ productId: "...", quantity: 2 }, ...]

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // Build the real order items by looking up each product's CURRENT price
    // (never trust a price sent from the frontend — always verify from the database)
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      const quantity = item.quantity || 1;
      const itemTotal = product.price * quantity;
      totalPrice += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
      });
    }

    const newOrder = new Order({
      user: req.user.id, // comes from the auth middleware, not from the request body
      items: orderItems,
      totalPrice,
      status: "placed",
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get the logged-in user's own order history
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;