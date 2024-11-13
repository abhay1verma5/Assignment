require("dotenv").config(); // This must be at the very top of the file
const { processImages } = require("../services/imageProcessingService");
const mongoose = require("mongoose");
const Product = require("../models/productModel");

const connectDB = async () => {
  try {
   
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit if there is an error
  }
}; 
async function startProcessing() {
  const pendingRequests = await Product.find({ status: "Pending" });
  for (const request of pendingRequests) {
    await Product.findOneAndUpdate(

      {requestId:request.requestId},
     
      { status: "Processing", updatedAt: new Date() }
    );
    
    processImages(request.requestId);
  }
} 
 
startProcessing();

module.exports = connectDB;
