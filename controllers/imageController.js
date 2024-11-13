const Product = require("../models/productModel");
const { processImages } = require("../services/imageProcessingService");
const { v4: uuidv4 } = require("uuid");
const parseCSV = require("../utils/csvParser");
const path = require("path");

exports.uploadCSV = async (req, res) => {
  try {
    const requestId = uuidv4();
    const filePath = path.join(__dirname, "..", "uploads", req.file.filename);
    const products = await parseCSV(filePath);

    const productDocs = products.map((product) => ({
      serialNumber: parseInt(product["S. No."]),
      productName: product["Product Name"],
      inputImageUrls: product["Input Image Urls"].split(","),
      requestId,
    }));

    await Product.insertMany(productDocs);
    processImages(requestId, productDocs);

    res.status(200).json({ requestId });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload CSV data" });
  }
};

exports.checkStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const products = await Product.find({ requestId });

    if (products.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }

    res.status(200).json({ status: products[0].status });
  } catch (error) {
    res.status(500).json({ error: "Failed to check status" });
  }
};
