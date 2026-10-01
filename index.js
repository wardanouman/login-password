import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { signJWT, verifyJWT } from "./utils/jwt.js";
import dns from "dns";

dns.setServers(["8.8.8.8","1.1.1.1"]);

dotenv.config(); // Loads MONGODB_URI and JWT_SECRET from .env

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Successfully connected to MongoDB Atlas!"))
  .catch((err) => console.error("MongoDB Atlas connection error:", err.message));

// Schemas & Models
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  image: { type: String, default: "https://via.placeholder.com/300x300?text=No+Product+Image" },
  createdAt: { type: Date, default: Date.now },
});
const Product = mongoose.model("Product", productSchema);

// Auth Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  try {
    req.user = verifyJWT(token);
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
};

// --- AUTH ROUTES ---
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });

    const existingUser = await User.findOne({ username: new RegExp(`^${username.trim()}$`, "i") });
    if (existingUser) return res.status(400).json({ error: "Username already taken" });

    const newUser = await User.create({ username: username.trim(), password });
    const token = signJWT({ username: newUser.username });
    res.status(201).json({ token, username: newUser.username });
  } catch (err) {
    res.status(500).json({ error: "Registration failed. " + err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: new RegExp(`^${username.trim()}$`, "i"), password });
    if (!user) return res.status(401).json({ error: "Invalid username or password" });

    const token = signJWT({ username: user.username });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: "Login failed. " + err.message });
  }
});

// --- PRODUCT ROUTES ---
app.get("/products", authenticate, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/products", authenticate, async (req, res) => {
  try {
    const { title, price, category, stock, image } = req.body;
    const product = await Product.create({
      title,
      price: parseFloat(price),
      category,
      stock: parseInt(stock, 10),
      image: image.trim() !=="" ? image : undefined,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: "Invalid product data" });
  }
});

app.delete("/products/:id", authenticate, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));