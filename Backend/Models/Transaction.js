const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  txHash: String,
  customer: String,
  creditHolder: String,
  tokenAmount: Number,
  energyUnits: Number,
  verified: Boolean,
  timestamp: Date
});

module.exports = mongoose.model("Transaction", TransactionSchema);