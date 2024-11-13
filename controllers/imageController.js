const Product = require("../models/productModel");
const { processImages } = require("../services/imageProcessingService");
const { v4: uuidv4 } = require("uuid");
const parseCSV = require("../utils/csvParser");
const path = require("path");

exports.uploadCSV = async (req, res) => {
  try {
    const requestId = uuidv4();

    // Get the file path
    const filePath = path.join(__dirname, "..", "uploads", req.file.filename);
    const products = await parseCSV(filePath);

    const request = await Product.find({ requestId });
  
   
    if (request.requestId === requestId) {
      return res.status(404).json({ message: "Duplicate Id found" });

    }

    // Map the CSV data to the product documents
    const productDocs = products.map((product) => ({
      serialNumber: product["BookID"], // Correct the key here
      productName: product["Title"], // Correct the key here
      inputImageUrls: product["CoverImageURL"], // Correct the key and use CoverImageURL
      requestId,
    }));

    // Insert products into MongoDB and process images
    await Product.insertMany(productDocs);
   

    // Respond with the requestId
    res.status(200).json({ requestId });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Failed to upload CSV data" });
  }
};

exports.checkStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const products = await Product.find({ requestId });
const st=await Product.find({status:"Completed"})

    if (products.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }
   
    

    res.status(200).json({ message:"data",status: products });
  } catch (error) {
    res.status(500).json({ error: "Failed to check status" });
  }
};

exports.updateProductStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body;

    // Validate input data
    if (
      !requestId ||
      !status 
     
    ) 
    {
      return res.status(400).json({
        error:
          "Invalid input: requestId, status are required",
      });
    }
const products = await Product.find({ requestId });

    
    for (const product of products) {
    
      const updatedProduct = await Product.findOneAndUpdate(
        { requestId }, 
        {
          status: status, // Update the status
          updatedAt: new Date(), // Set the updatedAt timestamp
        }
      );
      
     
     
    }

   
    res.status(200).json({
      message: "Webhook received and processed successfully", 
    });
  } catch (err) {
    console.error("Error updating product status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


