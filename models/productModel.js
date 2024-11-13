const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  serialNumber: Number,
  productName: String,
  inputImageUrls: [String],
  outputImageUrls: [String],
  requestId: String,
  status: {
    type: String,
    enum: ["Pending", "Processing", "Completed"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Product", productSchema);
