const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

function generateNonce() {
  return Math.floor(Math.random() * 1000000).toString();
}

app.get('/api/dbtest', async (req, res) => {
  try {
    // Try to count users
    const users = await prisma.user.findMany();
    res.json({ ok: true, users });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Get or register user, return nonce
app.post("/api/auth/request-nonce", async (req, res) => {
  const { address } = req.body;
  let user = await prisma.user.findUnique({ where: { address } });
  if (!user) {
    user = await prisma.user.create({
      data: { address, role: "Customer", nonce: generateNonce() }
    });
  }
  res.json({ nonce: user.nonce });
});

// (verified as before)
app.post("/api/auth/verify", async (req, res) => {
  // Optional: verify signature via ethers.recoverAddress/ecdsaRecover
  res.json({ success: true });
});

// Set user role
app.post("/api/user/set-role", async (req, res) => {
  const { address, role } = req.body;
  if (!["Verifier", "Customer", "CreditHolder"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  let user = await prisma.user.update({ where: { address }, data: { role } });
  res.json({ user });
});

// Get user info
app.get("/api/user/:address", async (req, res) => {
  const user = await prisma.user.findUnique({ where: { address: req.params.address } });
  res.json({ user });
});

// Create transaction
app.post("/api/transactions", async (req, res) => {
  const txn = await prisma.transaction.create({ data: req.body });
  res.json({ txn });
});

// Get all transactions (sorted by timestamp descending)
app.get("/api/transactions", async (req, res) => {
  const txns = await prisma.transaction.findMany({ orderBy: { timestamp: "desc" } });
  res.json({ txns });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));