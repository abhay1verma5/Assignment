require("dotenv").config(); // This must be at the very top of the file

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
   // console.log("Mongo URI:", process.env.MONGO_URI); // Check the value here
    await mongoose.connect(
      "mongodb+srv://abhay:CDHwMuuaJ2JhKEkl@cluster0.g6clnyx.mongodb.net/assignment",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit if there is an error
  }
}; 

module.exports = connectDB;
