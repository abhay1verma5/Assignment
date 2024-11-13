const Product = require("../models/productModel");
const sharp = require("sharp");
const fetch = require("node-fetch");
const cloudinary = require("cloudinary").v2;

// // Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// Process the images for all products
const processImages = async (requestId) => {
 const products = await Product.find({ requestId });

  for (const product of products) {
    const outputUrls = [];

    try {
      // Fetch and compress image
      const compressedImageBuffer = await fetchAndCompressImage(
        product.inputImageUrls
      );

      // Upload to Cloudinary
    //  const imageUrl = await uploadToCloudinary(compressedImageBuffer);

      // Update product with Cloudinary image URLs and status
      await Product.findOneAndUpdate(
        { requestId, serialNumber: product.serialNumber },
        { outputImageUrls: compressedImageBuffer, status: "Completed",updatedAt: new Date() }
      );
    } catch (error) {
      console.error(`Error processing product ${product.serialNumber}:`, error);
      // In case of an error, update product status to "Failed"
      await Product.findOneAndUpdate(
        { requestId, serialNumber: product.serialNumber },
        { status: "Failed", updatedAt: new Date() }
      );
    }
  }
};

// Fetch the image and compress it
const fetchAndCompressImage = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${url}`);
    }
    const imageBuffer = await response.buffer();

    // Compress the image using sharp
    return sharp(imageBuffer).resize({ width: 800 }).toBuffer();
  } catch (error) {
    console.error(`Error fetching or compressing image: ${url}`, error);
    throw error;
  }
};

// Upload image buffer to Cloudinary
const uploadToCloudinary = async (buffer) => {
  try {
    // Upload to Cloudinary and get the URL
    const result = await cloudinary.uploader.upload_stream(
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
    const stream = bufferToStream(buffer);
    stream.pipe(result);

    // Return the secure URL once upload is complete
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

// Convert a buffer into a readable stream
const bufferToStream = (buffer) => {
  const stream = require("stream");
  const readable = new stream.PassThrough();
  readable.end(buffer);
  return readable;
};

module.exports = { processImages };
