import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prescription';
  mongoose.connection.on("connected", () => console.log("Database connected"));
  mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err));
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message || error);
    process.exit(1);
  }
};

export default connectDB;