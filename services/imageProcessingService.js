const Product = require("../models/productModel");
const sharp = require("sharp");
const fetch = require("node-fetch");
const cloudinary = require("cloudinary").v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const processImages = async (requestId, products) => {
  for (const product of products) {
    const outputUrls = [];

    try {
      
        const compressedImageBuffer = await fetchAndCompressImage(
          product.inputImageUrls
        );
       
        
      

      // Wait for all image processing to complete
     

      // Update the product in MongoDB
      await Product.findOneAndUpdate(
        { requestId, serialNumber: product.serialNumber },
        { outputImageUrls: compressedImageBuffer, status: "Completed" }
      );
    } catch (error) {
      console.error(`Error processing product ${product.serialNumber}:`, error);
      await Product.findOneAndUpdate(
        { requestId, serialNumber: product.serialNumber },
        { status: "Failed" }
      );
    }
  }
};

const fetchAndCompressImage = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${url}`);
    }
    const imageBuffer = await response.buffer();
    return sharp(imageBuffer).resize({ width: 800 }).toBuffer();
  } catch (error) {
    console.error(`Error fetching or compressing image: ${url}`, error);
    throw error;
  }
};

const uploadToCloudinary = async (buffer) => {
  try {
    // Upload the image buffer to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary:", error);
          throw error;
        }
        return result.secure_url; // Return the URL of the uploaded image
      }
    );
    

    // Create a readable stream from the image buffer and pipe it to Cloudinary
    buffer.pipe(uploadResponse);
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};


module.exports = { processImages };


