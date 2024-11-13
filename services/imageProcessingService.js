const Product = require("../models/productModel");
const sharp = require("sharp");

const processImages = async (requestId, products) => {
  for (const product of products) {
    const outputUrls = [];

    for (const url of product.inputImageUrls) {
      const compressedImageBuffer = await fetchAndCompressImage(url);
      const outputUrl = await uploadToStorage(compressedImageBuffer); // Assume this uploads and gets URL
      outputUrls.push(outputUrl);
    }

    await Product.findOneAndUpdate(
      { requestId, serialNumber: product.serialNumber },
      { outputImageUrls: outputUrls, status: "Completed" }
    );
  }
};

const fetchAndCompressImage = async (url) => {
  const response = await fetch(url);
  const imageBuffer = await response.buffer();
  return sharp(imageBuffer).resize({ width: 800 }).toBuffer();
};

const uploadToStorage = async (buffer) => {
  // Dummy function: in a real app, upload buffer to cloud storage (e.g., AWS S3) and return URL.
  return "https://dummyimage.com/output.jpg";
};

module.exports = { processImages };
