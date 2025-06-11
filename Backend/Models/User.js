const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  role: { type: String, enum: ["Verifier", "Customer", "CreditHolder"], required: true },
  nonce: { type: String, required: true, default: () => Math.floor(Math.random() * 1000000).toString() }
});

module.exports = mongoose.model("User", UserSchema);